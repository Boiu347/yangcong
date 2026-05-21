import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  clipUrl: string;
  startTime?: number;
}

function fmt(s?: number): string {
  if (s == null) return '听原声';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioChip({ clipUrl, startTime }: Props) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(clipUrl);
      audioRef.current.onended = () => setPlaying(false);
      audioRef.current.onpause = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all',
        playing
          ? 'bg-[#4361EE] text-white border-[#4361EE]'
          : 'bg-[#4361EE]/5 text-[#4361EE] border-[#4361EE]/20 hover:bg-[#4361EE] hover:text-white hover:border-[#4361EE]',
      )}
    >
      <span>{playing ? '⏸' : '▶'}</span>
      <span>{fmt(startTime)}</span>
    </button>
  );
}
