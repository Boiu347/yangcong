# -*- coding: utf-8 -*-
"""Match paisou-workshop.html quotes to Feishu minute transcripts and slice audio clips."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from difflib import SequenceMatcher
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MINUTES_DIR = ROOT / "minutes"
HTML_PATH = ROOT / "client/public/paisou-workshop.html"
CLIPS_DIR = ROOT / "client/public/clips/paisou"
LOOKUP_PATH = ROOT / "client/public/paisou-clip-lookup.json"

MIN_SIMILARITY = 0.42
MIN_CHUNK_CHARS = 6
PADDING_SEC = 0.4

# 模糊匹配容易错位时，用手动时间范围（秒）覆盖
MANUAL_TIME_RANGES: dict[str, dict[str, tuple[float, float]]] = {
    "吴语遥": {
        "就是想到老师说，不会的题不要一直并着，可以让我们就去找老师啥的解决这个问题。因为联系不上老师，就去搞那个作业批改。": (521.57, 553.0),
        "当时就是看到题目，然后又先写了一下，然后发现就写了这个，不会写了就拍。": (612.05, 625.5),
        "不是完全没思路，是有一点思路，但中间过程卡住了，就拍搜。": (634.74, 641.5),
    },
    "徐同学": {
        "有的时候就会用洋葱了。": (1936.85, 1962.0),
        "因为豆包有些答案经常是错的。": (1246.29, 1253.0),
        "就是有些卷子用它查完之后。答案可能填上面，第二天老师讲一下，然后看一下结果是错的。": (1502.64, 1513.0),
        "有的时候会觉得无所谓，然后可能有的时候就会用洋葱了。": (1936.85, 1947.5),
        "有的时候会觉得无所谓，然后可能有的时候就会用洋葱了。就是时间比较充足的时候，七点半左右把作业全部写完的时候。": (1936.85, 1962.0),
        "写完后用洋葱，我一般是先拍题再赶时间看课：要是当天讲过的题在解题课里刚好有，就先上看课；没有才拍搜。物理题十次里六七八次能在解题课里碰到相似题型——化学几乎碰不到，所以看课时间主要留给物理。": (2030.5, 2065.0),
    },
    "诺诗": {
        "洋葱讲题语气委婉、温柔、有耐心，更像朋友，不像老师和长辈那样严肃。": (868.87, 947.5),
        "作业帮没有感情，只是单纯讲题，听不进去。": (893.51, 908.5),
        "洋葱拍题时有人物模型，小锤和狗蛋，比较有趣，能提升我的兴趣。": (796.24, 868.87),
        "小洋葱。肖晨。不，那个。": (796.24, 804.5),
        "我的。因为他说话不像老师。就是他要讲的那一块的那样。": (931.0, 947.5),
        "因为他说话不像老师。就是他要讲的那一块的那样。": (940.7, 947.5),
        "洋葱比作业帮使用高频，原因是洋葱更容易理解，更有兴趣一点，作业帮讲得太无聊了。": (603.6, 648.7),
        "做几何题完全不会做，我尝试自己做了一下，没有思路。": (1151.7, 1196.4),
    },
}

USER_TOKEN: dict[str, str] = {
    "吴语遥": "obcnb2727a2g1i54ibtne6p9",
    "徐同学": "obcnb3r4z744i193ia481g6q",
    "吕同学": "obcnfdz14n1d9e5g625yoq1q",
    "诺诗": "obcnfkhu72dk55aer2da82mk",
    "小林": "obcnog21c4m2t4u127onurfk",
}

SPEAKER_LINE = re.compile(
    r"^(?:Speaker\s+\d+|[^ \t]+)\s+(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*$"
)


def ts_to_sec(h: str, m: str, s: str, ms: str) -> float:
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0


def clean_text(text: str) -> str:
    text = re.sub(r"[，。！？、；：\"\"''（）【】《》…—\-·\s]", "", text)
    return re.sub(r"\*\*", "", text)


def split_chunks(text: str) -> list[str]:
    parts = re.split(r"[。！？；\n—]+|(?:……)+", text)
    out: list[str] = []
    for p in parts:
        p = p.strip().strip("""''""").strip()
        if len(clean_text(p)) >= MIN_CHUNK_CHARS:
            out.append(p)
    return out


def find_token_dir(token: str) -> Path | None:
    for d in MINUTES_DIR.iterdir():
        if d.is_dir() and token in d.name:
            return d
    return None


def find_media(token: str) -> Path | None:
    token_dir = find_token_dir(token)
    candidates: list[Path] = []
    if token_dir:
        candidates.extend(token_dir.glob("*.mp4"))
        candidates.extend(token_dir.glob("*.mp3"))
        candidates.extend(token_dir.glob("*.m4a"))
    for p in MINUTES_DIR.glob("*.mp4"):
        if token in p.name:
            candidates.append(p)
    for p in MINUTES_DIR.glob("*.mp3"):
        if token in p.name:
            candidates.append(p)
    # fuzzy: match by user folder prefix before token
    if token_dir:
        prefix = token_dir.name.split(f"-{token}")[0]
        for p in MINUTES_DIR.glob("*.mp4"):
            if prefix.split("artifact-")[-1][:8] in p.name:
                candidates.append(p)
    seen: set[str] = set()
    uniq: list[Path] = []
    for p in candidates:
        key = str(p.resolve())
        if key not in seen and p.exists() and p.stat().st_size > 1_000_000:
            seen.add(key)
            uniq.append(p)
    if not uniq:
        return None
    return max(uniq, key=lambda p: p.stat().st_size)


def parse_transcript(path: Path) -> tuple[list[dict], int | None]:
    lines = path.read_text(encoding="utf-8").splitlines()
    raw: list[dict] = []
    i = 0
    while i < len(lines):
        m = SPEAKER_LINE.match(lines[i].strip())
        if not m:
            i += 1
            continue
        speaker = lines[i].strip().split()[0]
        if speaker.startswith("Speaker"):
            speaker = lines[i].strip().rsplit(" ", 1)[0]
        start = ts_to_sec(*m.groups())
        i += 1
        text_parts: list[str] = []
        while i < len(lines) and not SPEAKER_LINE.match(lines[i].strip()):
            t = lines[i].strip()
            if t:
                text_parts.append(t)
            i += 1
        text = "".join(text_parts)
        if text:
            raw.append({"speaker": speaker, "start": start, "text": text})

    segments: list[dict] = []
    for idx, seg in enumerate(raw):
        end = raw[idx + 1]["start"] if idx + 1 < len(raw) else seg["start"] + max(3.0, len(seg["text"]) * 0.18)
        segments.append({**seg, "end": end})

    spk_dur: dict[str, float] = {}
    for seg in segments:
        if seg["speaker"].startswith("Speaker"):
            spk_dur[seg["speaker"]] = spk_dur.get(seg["speaker"], 0) + (seg["end"] - seg["start"])
    student_spk = max(spk_dur, key=spk_dur.get) if spk_dur else None
    return segments, student_spk


def find_best_match(query: str, segments: list[dict], window_sizes=(2, 3, 5, 7, 9)) -> dict | None:
    clean_q = clean_text(query)
    if len(clean_q) < 5:
        return None
    best = None
    best_score = MIN_SIMILARITY
    for ws in window_sizes:
        for i in range(len(segments)):
            end_i = min(i + ws, len(segments))
            window_text = "".join(s["text"] for s in segments[i:end_i])
            clean_w = clean_text(window_text)
            score = SequenceMatcher(None, clean_q, clean_w).ratio()
            if clean_q in clean_w or clean_w in clean_q:
                score = max(score, 0.82)
            overlap = len(set(clean_q) & set(clean_w)) / max(len(clean_q), 1)
            combined = score * 0.65 + overlap * 0.35
            if combined > best_score:
                best_score = combined
                best = {
                    "start": segments[i]["start"],
                    "end": segments[end_i - 1]["end"],
                    "matched_text": window_text[:120],
                    "score": combined,
                }
    return best


def find_matches(query: str, segments: list[dict], student_spk: str | None) -> list[dict]:
    student_segs = [s for s in segments if student_spk and s["speaker"] == student_spk]
    seen: set[str] = set()
    matches: list[dict] = []
    for chunk in [query] + split_chunks(query):
        c = chunk.strip().strip("""''""").strip()
        if c in seen:
            continue
        seen.add(c)
        m = None
        if student_segs:
            m = find_best_match(c, student_segs)
        if not m:
            m = find_best_match(c, segments)
        if m:
            matches.append({**m, "chunk": c})
    # dedupe overlapping
    kept: list[dict] = []
    for m in sorted(matches, key=lambda x: -x["score"]):
        if any(not (m["end"] + 2 < k["start"] or k["end"] + 2 < m["start"]) for k in kept):
            continue
        kept.append(m)
    return sorted(kept, key=lambda x: x["start"])


def slice_audio(src: Path, start: float, end: float, out: Path):
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists():
        out.unlink(missing_ok=True)
    start_p = max(0.0, start - PADDING_SEC)
    dur = max(0.8, (end + PADDING_SEC) - start_p)
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-ss", f"{start_p:.3f}",
        "-i", str(src),
        "-t", f"{dur:.3f}",
        "-vn", "-acodec", "libmp3lame", "-q:a", "4",
        str(out),
    ]
    subprocess.run(cmd, check=True)


class QuoteExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.quotes: list[dict] = []
        self._stack: list[str] = []
        self._current_user: str | None = None
        self._capture: str | None = None
        self._buf: list[str] = []

    def handle_starttag(self, tag, attrs):
        cls = dict(attrs).get("class", "")
        self._stack.append(tag)
        if tag == "article" and "scene" in cls.split():
            self._current_user = None
        if tag == "span" and "who" in cls.split():
            self._capture = "who"
            self._buf = []
        if tag in ("div", "p") and any(c in cls.split() for c in ("v", "voice")):
            self._capture = "quote"
            self._buf = []

    def handle_endtag(self, tag):
        if self._stack and self._stack[-1] == tag:
            self._stack.pop()
        if tag == "span" and self._capture == "who":
            who = "".join(self._buf).strip()
            for name in USER_TOKEN:
                if name in who:
                    self._current_user = name
                    break
            self._capture = None
            self._buf = []
        if tag in ("div", "p") and self._capture == "quote":
            text = "".join(self._buf).strip()
            text = re.sub(r"\s+", " ", text)
            text = text.strip("""''""").strip()
            user = self._current_user
            if not user:
                for name in USER_TOKEN:
                    if name in text:
                        user = name
                        break
            if tag == "div" and "who" not in text:
                m = re.search(r"(吴语遥|徐同学|丁同学|吕同学|诺诗|小林)", text)
                if m:
                    user = user or m.group(1)
            if len(clean_text(text)) >= 8:
                self.quotes.append({"text": text, "user": user})
            self._capture = None
            self._buf = []

    def handle_data(self, data):
        if self._capture:
            self._buf.append(data)


def normalize_quote(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    return text.strip("""''""").strip('"').strip("“”").strip()


def extract_switch_quotes(html: str) -> list[dict]:
    out: list[dict] = []
    starts = [m.start() for m in re.finditer(r'<div class="switch">', html)]
    for i, start in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else html.find("</div>\n    </div>\n  </div>\n</section>", start)
        if end < 0:
            end = len(html)
        block = html[start:end]
        src_m = re.search(r'<div class="src">[^<]*?([^<]+)</div>', block)
        src_text = src_m.group(1) if src_m else ""
        users = [name for name in USER_TOKEN if name in src_text]
        qs = re.findall(r'<div class="q">(.*?)</div>', block, flags=re.S)
        for j, raw in enumerate(qs):
            text = normalize_quote(re.sub(r"<[^>]+>", "", raw))
            if len(clean_text(text)) < 8:
                continue
            user = users[j] if j < len(users) else (users[0] if users else None)
            out.append({"text": text, "user": user})
    return out


def extract_quotes() -> list[dict]:
    html = HTML_PATH.read_text(encoding="utf-8")
    parser = QuoteExtractor()
    parser.feed(html)
    # scene cards: set user from .who span in .head
    scene_users = re.findall(
        r'<article class="scene">.*?<span class="who">([^<]+)</span>',
        html,
        flags=re.S,
    )
    scene_v_blocks = re.findall(
        r'<div class="voices">(.*?)</div>\s*<p class="tag">',
        html,
        flags=re.S,
    )
    for user, block in zip(scene_users, scene_v_blocks):
        if user not in USER_TOKEN:
            continue
        for v in re.findall(r'<div class="v[^"]*">(.*?)</div>', block, flags=re.S):
            text = normalize_quote(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", v)).strip())
            if len(clean_text(text)) >= 8:
                parser.quotes.append({"text": text, "user": user})

    for item in extract_switch_quotes(html):
        parser.quotes.append(item)

    # evidence voices with who span
    for block in re.findall(r'<div class="voice[^"]*">(.*?)</div>', html, flags=re.S):
        plain = re.sub(r"<span[^>]*>.*?</span>", "", block, flags=re.S)
        text = normalize_quote(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", plain)).strip())
        who_m = re.search(r"<span class=\"who\">([^<]+)</span>", block)
        user = None
        if who_m:
            for name in USER_TOKEN:
                if name in who_m.group(1):
                    user = name
                    break
        if len(clean_text(text)) >= 8:
            parser.quotes.append({"text": text, "user": user})

    # dedupe by text
    seen: set[str] = set()
    out: list[dict] = []
    for q in parser.quotes:
        key = clean_text(q["text"])
        if key in seen:
            continue
        seen.add(key)
        out.append(q)
    return out


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    quotes = extract_quotes()
    print(f"提取原声 {len(quotes)} 条")

    lookup: dict[str, dict] = {}
    report = {"matched": [], "unmatched": [], "no_audio": []}
    clip_idx = 0

    by_user: dict[str, list[dict]] = {}
    for q in quotes:
        by_user.setdefault(q.get("user") or "?", []).append(q)

    for user, token in USER_TOKEN.items():
        media = find_media(token)
        token_dir = find_token_dir(token)
        transcript_path = token_dir / "transcript.txt" if token_dir else None
        if not media or not transcript_path or not transcript_path.exists():
            print(f"[SKIP] {user}: media={bool(media)} transcript={bool(transcript_path and transcript_path.exists())}")
            for q in by_user.get(user, []):
                report["no_audio"].append(q)
            continue

        segments, student_spk = parse_transcript(transcript_path)
        print(f"[{user}] segments={len(segments)} student={student_spk} media={media.name}")

        user_clip_dir = CLIPS_DIR / token[:8]
        user_clip_dir.mkdir(parents=True, exist_ok=True)

        for q in by_user.get(user, []):
            text = q["text"]
            manual = MANUAL_TIME_RANGES.get(user, {}).get(text)
            if manual:
                start_m, end_m = manual
                matches = [{
                    "start": start_m,
                    "end": end_m,
                    "matched_text": text[:120],
                    "score": 1.0,
                    "chunk": text,
                }]
            else:
                matches = find_matches(text, segments, student_spk)
            if not matches:
                report["unmatched"].append({"user": user, "text": text})
                print(f"  [--] {text[:40]}...")
                continue

            clip_idx += 1
            clips = []
            for mi, m in enumerate(matches[:2], start=1):
                fname = f"{clip_idx:03d}-{mi:02d}.mp3"
                out = user_clip_dir / fname
                slice_audio(media, m["start"], m["end"], out)
                entry = {
                    "clipUrl": f"/clips/paisou/{token[:8]}/{fname}",
                    "startTime": round(m["start"], 1),
                    "duration": round(max(0.8, m["end"] - m["start"]), 1),
                }
                clips.append(entry)

            lookup[text] = clips[0] if len(clips) == 1 else clips
            report["matched"].append(
                {"user": user, "text": text, "clips": clips, "score": round(matches[0]["score"], 2)}
            )
            print(f"  [OK] score={matches[0]['score']:.2f} | {text[:36]}...")

    # quotes without user — skip cross-user to avoid wrong matches (e.g. 梦梅 -> 吴语遥)
    for q in by_user.get("?", []):
        report["unmatched"].append({"user": None, "text": q["text"]})

    LOOKUP_PATH.write_text(json.dumps(lookup, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "scripts/paisou-clip-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("=" * 50)
    print(f"matched: {len(report['matched'])}")
    print(f"unmatched: {len(report['unmatched'])}")
    print(f"no_audio user: {len(report['no_audio'])}")
    print(f"lookup -> {LOOKUP_PATH}")


if __name__ == "__main__":
    main()
