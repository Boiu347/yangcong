export type InsightEvidenceType =
  | '问卷定量'
  | '行业数据'
  | '业务数据'
  | '案头研究'
  | '策略推演';

export interface InsightMetric {
  value: string;
  label: string;
  detail: string;
  scope: string;
  type: InsightEvidenceType;
  source: string;
}

export interface InsightComparison {
  name: string;
  color: string;
  role: string;
  strength: string;
  gap: string;
}

export interface IndustryInsightTheme {
  layout: 'industry-story';
  id: 'segments' | 'decision' | 'service' | 'renewal';
  tab: string;
  eyebrow: string;
  title: string;
  thesis: string;
  involved: string[];
  metrics: InsightMetric[];
  comparisonTitle: string;
  comparisons: InsightComparison[];
  interpretations: string[];
  actions: string[];
  caveat: string;
}

export interface SatisfactionSegment {
  label: string;
  value: number;
  count: number;
  color: string;
}

export interface SatisfactionDistribution {
  label: string;
  note: string;
  segments: SatisfactionSegment[];
}

export interface SatisfactionRelation {
  title: string;
  note: string;
  groups: Array<{
    label: string;
    value: number;
    positive: number;
    total: number;
    lowSample?: boolean;
  }>;
}

export interface SatisfactionVocPath {
  id: string;
  title: string;
  metric: string;
  scope: string;
  color: string;
  source: string;
  signal: string;
  path: string[];
  purchaseImpact: string;
  implication: string;
  voices: Array<{
    text: string;
    context: string;
    kind: '高频代表' | '典型阻力' | '强烈负向' | '具体诉求';
  }>;
}

export interface SatisfactionInsightTheme {
  layout: 'satisfaction-survey';
  id: 'satisfaction';
  tab: string;
  eyebrow: string;
  title: string;
  thesis: string;
  sample: string;
  metrics: InsightMetric[];
  distributionBars: SatisfactionDistribution[];
  purchaseIntent: SatisfactionSegment[];
  dissatisfactionPaths: SatisfactionVocPath[];
  driverRelations: SatisfactionRelation[];
  improvementSignals: Array<{
    title: string;
    color: string;
    items: Array<{ value: string; label: string; detail: string }>;
  }>;
  actions: string[];
  caveat: string;
}

export interface SatisfactionVoicesTheme {
  layout: 'satisfaction-voices';
  id: 'satisfaction-voices';
  tab: string;
  eyebrow: string;
  title: string;
  thesis: string;
  sample: string;
  summaryPoints: Array<{
    title: string;
    detail: string;
  }>;
  dissatisfactionPaths: SatisfactionVocPath[];
  caveat: string;
}

export type CalculationInsightTheme =
  | IndustryInsightTheme
  | SatisfactionInsightTheme
  | SatisfactionVoicesTheme;

const BASE_CALCULATION_INSIGHT_THEMES: Array<IndustryInsightTheme | SatisfactionInsightTheme> = [
  {
    layout: 'industry-story',
    id: 'segments',
    tab: '用户分层与需求',
    eyebrow: '01 · 市场与用户',
    title: '主市场不是单一补差，而是多种计算任务共同存在。',
    thesis:
      '问卷揭示了四类渐进需求，行业研究进一步说明家长已经在教辅、App、数学班与自主辅导之间组合解决问题。计算营需要承接的不是一个统一人群，而是不同方案尚未完成的学习任务。',
    involved: ['计算营', '教辅/题卡', '计算 App', '综合数学班'],
    metrics: [
      {
        value: '61.4%',
        label: '巩固人群合计',
        detail: '巩固-夯实 31.3%，巩固-提速 30.1%，构成计算需求的规模中心。',
        scope: 'N=396',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '13.4%',
        label: '补差型占比',
        detail: '痛感最强但规模最小，更适合成为公域获客钩子，而非主产品的唯一画像。',
        scope: 'n=53',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '58.3%',
        label: '纸质教辅购买率',
        detail: '教辅仍是计算学习的第一入口，也是计算营必须跨越的默认参照物。',
        scope: '过去12个月，N=396',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '73.5%',
        label: '现有方案不满意',
        detail: '需求并未被主流方案充分满足，行业机会来自方案缺口而非新增需求教育。',
        scope: '整合口径',
        type: '行业数据',
        source: '行业整合报告',
      },
    ],
    comparisonTitle: '现有方案分别解决了什么，又留下了什么',
    comparisons: [
      {
        name: '计算营',
        color: '#E47B70',
        role: '专项服务承接',
        strength: '内容、诊断、督学有机会组成闭环。',
        gap: '不同分层仍共用一套产品节奏，深度和难度适配不足。',
      },
      {
        name: '教辅/题卡',
        color: '#5DB2B8',
        role: '市场第一入口',
        strength: '低价、稳定、购买简单，适合高频练习。',
        gap: '依赖家长批改和监督，无法解释错因与下一步。',
      },
      {
        name: '计算 App',
        color: '#7377C9',
        role: '数字化自主练习',
        strength: '即时批改、自动记录，使用门槛低。',
        gap: '孩子难坚持，深度诊断和真人信任不足。',
      },
      {
        name: '综合数学班',
        color: '#D9A34F',
        role: '付费带学方案',
        strength: '付费习惯成熟，有老师和长期学习关系。',
        gap: '覆盖面广但计算专项训练时间有限，错因诊断不够细。',
      },
    ],
    interpretations: [
      '补差用户由失分和速度问题触发；提速与提前学用户则由开学前规划和领先目标触发，不能共享同一套转化话术。',
      '教辅、App 和数学班不是单纯替代关系。家长往往组合使用多个方案，计算营的价值在于补齐诊断、督学和专项训练缺口。',
      '巩固-夯实型规模大、体验课转化自然，是主产品最稳妥的 P0；提前学型具有更高长期价值，但需要独立的深度路径。',
    ],
    actions: [
      '产品默认承接巩固-夯实，并为补差和提前学建立不同入口与难度路径。',
      '公域用问题型场景吸引补差与夯实人群，私域和达人渠道用规划与专业背书承接提前学。',
      '把综合数学班用户定义为互补型高质量目标，而不是要求家长二选一。',
    ],
    caveat:
      '问卷样本来自洋葱私域和公众号，绝对渗透率可能偏高；人群结构、方案差异和服务偏好更适合作为方向判断。',
  },
  {
    layout: 'industry-story',
    id: 'decision',
    tab: '购买决策',
    eyebrow: '02 · 认知与转化',
    title: '价格只是表象，真正的转化障碍是用户仍在用教辅账户评估服务。',
    thesis:
      '问卷给出价格上限，行业与定位研究解释了价格为什么显得高：计算营尚未建立“专项诊断与陪练服务”的品类心智。购买决策需要先改变参照物，再降低首次承诺。',
    involved: ['计算营', '教辅/题卡', '计算 App', '综合数学班', '1v1 私教'],
    metrics: [
      {
        value: '33.6%',
        label: '认知为教辅升级版',
        detail: '几十元题卡因此成为天然价格锚点，399 元的服务价值难以被理解。',
        scope: '产品认知题',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '59.7%',
        label: '高于300元不购买',
        detail: '四类人群差异仅约 3–7 个百分点，价格上限不能通过分群消除。',
        scope: '价格题，N=347',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '1.8%',
        label: '自然样本已购率',
        detail: '剔除已购用户和宣传社群后，品类仍处于“知道但不理解”的浅认知阶段。',
        scope: '公众号/短信样本，N=166',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '28.7%',
        label: '数学班用户同时买专项营',
        detail: '说明计算营与综合数学班已呈现互补关系，而非完全替代。',
        scope: '综合数学班购买者',
        type: '问卷定量',
        source: '定位策略报告',
      },
    ],
    comparisonTitle: '不同参照物会产生完全不同的价值判断',
    comparisons: [
      {
        name: '教辅/题卡',
        color: '#5DB2B8',
        role: '低价参照物',
        strength: '几元到几十元即可获得大量练习。',
        gap: '若计算营只表达“内容更系统”，就会被迫进入十倍价格比较。',
      },
      {
        name: '计算 App',
        color: '#7377C9',
        role: '工具参照物',
        strength: '批改和记录自动化，部分功能免费或低价。',
        gap: '对比 App 时必须说清督学、诊断解释和结果负责的增量。',
      },
      {
        name: '综合数学班',
        color: '#D9A34F',
        role: '互补型付费对象',
        strength: '家长已经接受为“有人教”付费。',
        gap: '不应攻击数学班，而应强调其无法投入足够时间做计算专项。',
      },
      {
        name: '1v1 私教',
        color: '#55AF89',
        role: '服务价值锚点',
        strength: '个性化、诊断与陪伴的价值认知成熟。',
        gap: '价格高且难规模化，适合成为计算营服务价值的上位参照。',
      },
    ],
    interpretations: [
      '“高于 300 元不买”不是独立的定价结论，而是教辅锚点、品类浅认知和一次性高承诺共同作用的结果。',
      '当前仅少量用户主动把计算营理解为 1v1 的高性价比替代，意味着服务定位尚未建立，但仍有重塑空间。',
      '综合数学班用户已经完成“花钱让别人管学习”的心理跨越，转化阻力低于纯教辅用户。',
    ],
    actions: [
      '首屏表达从“21天课程内容”改为“计算专项诊断、纠错、推题与陪练服务”。',
      '保留单期低门槛与体验课，让用户先验证效果，再进入多期或跨模块关系。',
      '针对不同来源使用不同参照：教辅用户讲省心，App 用户讲坚持与解释，数学班用户讲专项补位。',
    ],
    caveat:
      '“高性价比 1v1 替代”属于定位策略判断，不是用户已经形成的普遍认知；对外使用前应通过落地页与转化实验验证。',
  },
  {
    layout: 'industry-story',
    id: 'service',
    tab: '产品体验与服务价值',
    eyebrow: '03 · 产品与交付',
    title: '竞争优势不在题量，而在把诊断、练习、督学和效果证明连成闭环。',
    thesis:
      '问卷确定了服务优先级，案头研究解释了不同方案的结构性短板。计算营的机会是用 AI 承担高频执行，用真人完成关键解释与信任确认，在中等价格带提供接近 1v1 的服务体验。',
    involved: ['计算营', '教辅/题卡', '计算 App', '低价营课', '1v1 私教'],
    metrics: [
      {
        value: '90.2%',
        label: '即时批改必须有',
        detail: '对错和错因反馈是家长最重视的服务，高于单纯课程内容。',
        scope: '服务重要性，N=315',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '86.3%',
        label: '深度诊断必须有',
        detail: '指出薄弱点是第二优先级，直接对应现有方案“看不清问题”的缺口。',
        scope: '服务重要性，N=315',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '76.7%',
        label: '接受AI专项推题',
        detail: '提醒、记录和推题适合自动化，可降低高频服务的边际成本。',
        scope: '完全接受，N=232',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '51.7%',
        label: '接受AI独立答疑',
        detail: '答疑接受度明显较低，关键解释和信任建立仍需真人在台前。',
        scope: '完全接受，N=232',
        type: '问卷定量',
        source: '定位策略报告',
      },
    ],
    comparisonTitle: '服务闭环中的能力分布',
    comparisons: [
      {
        name: '教辅/题卡',
        color: '#5DB2B8',
        role: '练习供给',
        strength: '题量充足、体系成熟、成本最低。',
        gap: '缺少即时批改、错因诊断和督学，执行责任仍在家长。',
      },
      {
        name: '计算 App',
        color: '#7377C9',
        role: '自动执行',
        strength: '批改、记录和智能推题效率高。',
        gap: '缺少真人监督和关键解释，容易刷题走形式。',
      },
      {
        name: '低价营课',
        color: '#D9A34F',
        role: '内容加陪跑',
        strength: '有班主任、社群和周期性任务。',
        gap: '多为录播加习题册，个性化诊断与服务深度有限。',
      },
      {
        name: '1v1 私教',
        color: '#55AF89',
        role: '深度服务上限',
        strength: '真实错题诊断、定制题单和高密度陪伴最完整。',
        gap: '客单价高、人效受限，无法覆盖大众市场。',
      },
      {
        name: '计算营',
        color: '#E47B70',
        role: '规模化服务机会',
        strength: '具备内容、数据和辅导老师基础，可组合 AI 与真人。',
        gap: '目前服务感与效果外化仍不足，容易被理解为视频加打卡。',
      },
    ],
    interpretations: [
      '家长把即时批改和深度诊断排在算理内容之前，说明产品价值单位应从“有多少课”转为“解决了多少具体问题”。',
      'AI 的最佳作用不是替代所有老师，而是把提醒、记录、推题和报告做到高频稳定，让真人集中在答疑、诊断解读和结营规划。',
      '市场两端分别是低价工具和高价 1v1，中间仍缺少可规模化、对结果负责的专项陪练服务。',
    ],
    actions: [
      '统一产品闭环：入营诊断 → 错因解释 → 个性化推题 → 每周进步摘要 → 结营对比。',
      'AI 默认承担提醒、记录、推题和报告；老师确认关键诊断、复杂答疑和下一阶段建议。',
      '把老师服务从“提醒打卡”升级为“解释问题和给出下一步”，并在家长端持续可见。',
    ],
    caveat:
      '竞品能力来自公开资料和案头研究，描述的是可观察交付方式，不等同于真实用户满意度；具体差异仍需产品体验验证。',
  },
  {
    layout: 'industry-story',
    id: 'renewal',
    tab: '续费诊断',
    eyebrow: '04 · 商业模式与增长',
    title: '计算营不是无限订阅，而是有自然终点的阶段性服务关系。',
    thesis:
      '问卷解释谁会续报，业务数据揭示当前经营结果，商业模式报告进一步指出：真正要提升的是跨期与跨模块 LTV，而不是用降价掩盖价值感和产品节奏问题。',
    involved: ['计算营', 'App订阅', '低价营课', '1v1 陪跑'],
    metrics: [
      {
        value: '约30%',
        label: '业务实际续报率',
        detail: '比活跃私域问卷中的 44% 更适合作为经营基准。',
        scope: '当前业务口径',
        type: '业务数据',
        source: '商业模式思考',
      },
      {
        value: '54.2%',
        label: '续报为提前学下一阶段',
        detail: '续报第一动力不是优惠，而是新的学习目标。',
        scope: '已续报用户，n=48',
        type: '问卷定量',
        source: '问卷调研2',
      },
      {
        value: '626→1,047',
        label: '四期人均LTV',
        detail: '续报率从 30% 提升到 60% 时，人均 LTV 增长约 67%。',
        scope: '情景测算，单位：元',
        type: '策略推演',
        source: '定位策略报告',
      },
      {
        value: '17.21%',
        label: '应用题营拓科率',
        detail: '跨模块承接显著高于同类计算月度续费，说明下一需求比重复内容更有吸引力。',
        scope: '4月业务数据',
        type: '业务数据',
        source: '商业模式思考',
      },
    ],
    comparisonTitle: '不同模式如何维持用户关系',
    comparisons: [
      {
        name: 'App订阅',
        color: '#7377C9',
        role: '技术驱动留存',
        strength: '游戏化、连续记录和进度积累制造使用习惯。',
        gap: '计算并非永久高频需求，缺少真人服务时家长价值感偏弱。',
      },
      {
        name: '低价营课',
        color: '#D9A34F',
        role: '节点型交易',
        strength: '低门槛、假期场景自然，适合快速获客。',
        gap: '结营即关系重置，依赖下一次重新销售。',
      },
      {
        name: '1v1 陪跑',
        color: '#55AF89',
        role: '强关系服务',
        strength: '持续服务和个性化计划带来较高长期付费意愿。',
        gap: '人效和价格限制规模，难以成为大众解法。',
      },
      {
        name: '计算营',
        color: '#E47B70',
        role: '阶段性服务订阅',
        strength: '可通过计算、应用题和思维等专题连续承接成长阶段。',
        gap: '当前按期销售、跨期断档，进步资产和用户关系尚未沉淀。',
      },
    ],
    interpretations: [
      '17.4% 未续报用户表示计算问题已解决，这不是传统意义上的流失，而是计算专项存在自然完成点。',
      '价格偏高和效果不明显共同指向价值感不足；开放题中的时间冲突则说明月度产品节奏与家庭按学期、寒暑假决策的节奏不一致。',
      '降价 25% 需要续报率接近 55% 才能弥补 LTV 损失，优先让效果可见和关系不断档更划算。',
    ],
    actions: [
      '把核心指标从单月续费扩展为学年复购、跨期回流、跨模块转化和总 LTV。',
      '结营前同时交付进步报告、保温练习与下一专题规划，避免关系在第 21 天清零。',
      '学期中提供轻量保温，寒暑假提供系统训练；问题解决后主动承接应用题和思维专题。',
    ],
    caveat:
      'LTV 为情景测算，不是已经实现的收入结果；开放题中的时间冲突只能作为原因解释，不能当作独立选择率。',
  },
  {
    layout: 'satisfaction-survey',
    id: 'satisfaction',
    tab: '满意度调研',
    eyebrow: '05 · 结营体验与后续意向',
    title: '高满意不等于自然续费，效果可见才是转化关键。',
    thesis:
      '本页聚焦封闭题分布、体验评价与续购关联：老师服务和任务安排总体评价较高，但明确续购同类计算营的用户只有 41.3%。开放题原因、代表性原声与定性总结请继续查看后面的“用户原声与总结”。',
    sample: '3月期 · N=247 · 96.8%由家长填写 · 一至六年级',
    metrics: [
      {
        value: '96.8%',
        label: '辅导老师总体满意',
        detail: '非常满意 76.5%，比较满意 20.2%；及时反馈是老师服务的主要价值。',
        scope: '239/247',
        type: '问卷定量',
        source: '满意度问卷',
      },
      {
        value: '92.7%',
        label: '每日任务安排总体满意',
        detail: '多数用户认可当前安排，但开放题显示“太密集”和“题量不足”同时存在。',
        scope: '229/247',
        type: '问卷定量',
        source: '满意度问卷',
      },
      {
        value: '77.7%',
        label: '感知到学习改善',
        detail: '52.6%认为做题习惯改善，25.1%认为知识掌握和正确率得到提升。',
        scope: '192/247',
        type: '问卷定量',
        source: '满意度问卷',
      },
      {
        value: '41.3%',
        label: '明确续购同类计算营',
        detail: '另有 23.9% 希望继续付费，但转向应用题、思维等其他数学专项。',
        scope: '102/247',
        type: '问卷定量',
        source: '满意度问卷',
      },
    ],
    distributionBars: [
      {
        label: '学习难度',
        note: '偏简单用户接近四分之一，分层仍有必要。',
        segments: [
          { label: '难度适中', value: 71.7, count: 177, color: '#5B7BBF' },
          { label: '偏简单', value: 24.7, count: 61, color: '#A7B7D8' },
          { label: '偏困难', value: 3.6, count: 9, color: '#E07A6E' },
        ],
      },
      {
        label: '每日任务量',
        note: '总体满意度高，但需要为不同家庭提供节奏档位。',
        segments: [
          { label: '非常满意', value: 66.0, count: 163, color: '#4BA69E' },
          { label: '比较满意', value: 26.7, count: 66, color: '#93C9C4' },
          { label: '一般', value: 7.3, count: 18, color: '#D8DEDF' },
        ],
      },
      {
        label: '辅导老师服务',
        note: '高满意主要来自学习情况的及时反馈。',
        segments: [
          { label: '非常满意', value: 76.5, count: 189, color: '#4BA69E' },
          { label: '比较满意', value: 20.2, count: 50, color: '#93C9C4' },
          { label: '一般', value: 3.2, count: 8, color: '#D8DEDF' },
        ],
      },
      {
        label: '效果感知',
        note: '22.2% 暂未看到变化或认为没有效果。',
        segments: [
          { label: '习惯改善', value: 52.6, count: 130, color: '#5B7BBF' },
          { label: '掌握知识', value: 25.1, count: 62, color: '#4BA69E' },
          { label: '暂未变化', value: 20.2, count: 50, color: '#D9A34F' },
          { label: '没有效果', value: 2.0, count: 5, color: '#E07A6E' },
        ],
      },
    ],
    purchaseIntent: [
      { label: '继续购买计算营', value: 41.3, count: 102, color: '#4BA69E' },
      { label: '转向其他数学专项', value: 23.9, count: 59, color: '#5B7BBF' },
      { label: '暂不确定', value: 30.0, count: 74, color: '#D9A34F' },
      { label: '不购买', value: 4.9, count: 12, color: '#E07A6E' },
    ],
    dissatisfactionPaths: [
      {
        id: 'effect',
        title: '效果未显现',
        metric: '22.3%',
        scope: '55/247 · 封闭题',
        color: '#D45C54',
        source: '能力锻炼题 + 续购题',
        signal: '50 人暂未看到变化，5 人明确认为没有效果。',
        path: ['进步没有被看见', '价值感下降', '续购转为犹豫或退出'],
        purchaseImpact: '该人群同类计算营续购仅 5.5%（3/55）',
        implication: '优先补齐前后测、错因变化和阶段报告，而不是只强调完成任务。',
        voices: [
          { text: '孩子的**错题还是错题**。', context: '犹豫续购', kind: '高频代表' },
          { text: '目前**没看到比较有效果的提升**。', context: '犹豫续购', kind: '典型阻力' },
          { text: '学期内比较耽误时间，另外**学习效果没有达到预期**，没有计算营孩子在家也是这么自己学习。', context: '犹豫续购', kind: '强烈负向' },
          { text: '希望老师针对孩子错题，提供**有针对性的步骤讲解和同类型加练**，三连对才是真的会。', context: '直播建议', kind: '具体诉求' },
        ],
      },
      {
        id: 'rhythm',
        title: '时间与任务节奏',
        metric: '34.0%',
        scope: '84/247 · 封闭题',
        color: '#D59A3A',
        source: '任务量题 + 改进方向',
        signal: '84 人未给任务量最高评价，其中 51 人希望每周留一天缓冲。',
        path: ['任务过密或过少', '与校内及家庭安排冲突', '推迟到假期或放弃'],
        purchaseImpact: '该人群同类计算营续购为 21.4%（18/84）',
        implication: '提供轻量、标准、加练档位，并设置缓冲日和可回看内容。',
        voices: [
          { text: '每天都有，**没有缓冲的时间**，孩子还有其他作业要写。', context: '犹豫续购', kind: '高频代表' },
          { text: '学期内比较耽误时间，**假期会考虑**。', context: '犹豫续购', kind: '典型阻力' },
          { text: '上课期间每天要看 2—3 集视频课，孩子**时间压力太大**。', context: '其他建议', kind: '强烈负向' },
          { text: '连续的任务量太密集了，**每周可以休息消化一天**。', context: '任务改进方向', kind: '具体诉求' },
        ],
      },
      {
        id: 'difficulty',
        title: '内容难度与分层',
        metric: '28.3%',
        scope: '70/247 · 封闭题',
        color: '#5B7BBF',
        source: '学习难度题 + 开放题',
        signal: '61 人认为偏简单，9 人认为偏困难，需求同时向两端分化。',
        path: ['难度与孩子不匹配', '内容帮助感不足', '要求分层或转向其他专项'],
        purchaseImpact: '该人群同类计算营续购为 30.0%（21/70）',
        implication: '入营测评后至少提供基础巩固与拔高加练两条任务路径。',
        voices: [
          { text: '对于苏教版的小孩来说**太简单了，题量也太少了**。', context: '犹豫续购', kind: '高频代表' },
          { text: '孩子幼儿园大班，有些内容还是**不太能理解**。', context: '犹豫续购', kind: '典型阻力' },
          { text: '此次课程**难度不大，没什么用**。', context: '犹豫续购', kind: '强烈负向' },
          { text: '计算营是否针对不同年级提供**分层教学**，比如补基础还是提前学？', context: '犹豫续购', kind: '具体诉求' },
        ],
      },
      {
        id: 'teacher',
        title: '老师反馈与服务感',
        metric: '3.2%',
        scope: '8/247 · 封闭题',
        color: '#4BA69E',
        source: '老师服务题 + 开放题',
        signal: '8 人评价一般、很少联系到辅导；人数少，但对续购影响极强。',
        path: ['联系少或反馈弱', '服务价值无法感知', '续购意向直接归零'],
        purchaseImpact: '8 人中 4 人不购买、4 人不确定，0 人明确续购',
        implication: '把及时反馈、错因解释和针对性加练设为可检查的服务标准。',
        voices: [
          { text: '辅导老师的用处并不多，**只是反馈是否做题、是否看视频**。', context: '犹豫续购', kind: '高频代表' },
          { text: '老师反馈能不能**主动及时，而不是需要家长催促**。', context: '其他建议', kind: '典型阻力' },
          { text: '这老师**信息都不看，不回**。', context: '直播建议', kind: '强烈负向' },
          { text: '希望老师除了指出问题，还能提供**针对问题的附加题**。', context: '其他建议', kind: '具体诉求' },
        ],
      },
      {
        id: 'value',
        title: '价格与价值感',
        metric: '≥9条',
        scope: '开放题信号 · 非发生率',
        color: '#8B6BB8',
        source: '犹豫原因 + 其他建议',
        signal: '价格常与会员内容重复、老师投入有限和题库价值不足同时出现。',
        path: ['感知交付与会员重叠', '300 元价值难解释', '性价比质疑'],
        purchaseImpact: '开放题为主动提及，不能直接换算总体占比',
        implication: '将收费理由从内容数量转为诊断、反馈、加练和进步证明。',
        voices: [
          { text: '价格偏高，有洋葱会员，每天还是**自己看视频学习、自己批改**。', context: '犹豫续购', kind: '高频代表' },
          { text: '本就是洋葱会员，**题库的价值并不会值这个价格**。', context: '犹豫续购', kind: '典型阻力' },
          { text: '这本来就是洋葱里的内容，有群、有老师督促打卡，就**收费 300 元**。', context: '犹豫续购', kind: '强烈负向' },
          { text: '希望价格亲民，能更针对孩子的**薄弱项有的放矢设计学习方案**。', context: '其他建议', kind: '具体诉求' },
        ],
      },
    ],
    driverRelations: [
      {
        title: '效果感知',
        note: '感知到习惯改善的人群，继续付费意向明显更高。',
        groups: [
          { label: '习惯改善', value: 83.8, positive: 109, total: 130 },
          { label: '暂未看到变化', value: 28.0, positive: 14, total: 50 },
        ],
      },
      {
        title: '老师服务',
        note: '及时反馈与继续付费意向同向变化。',
        groups: [
          { label: '非常满意', value: 73.0, positive: 138, total: 189 },
          { label: '比较满意', value: 46.0, positive: 23, total: 50 },
          { label: '评价一般', value: 0, positive: 0, total: 8, lowSample: true },
        ],
      },
      {
        title: '任务安排',
        note: '任务节奏体验越好，继续付费意向越高。',
        groups: [
          { label: '非常满意', value: 75.5, positive: 123, total: 163 },
          { label: '比较满意', value: 53.0, positive: 35, total: 66 },
          { label: '评价一般', value: 16.7, positive: 3, total: 18, lowSample: true },
        ],
      },
    ],
    improvementSignals: [
      {
        title: '任务节奏存在分化',
        color: '#D9A34F',
        items: [
          { value: '20.6%', label: '希望每周留一天休息', detail: '51/247，连续任务过密是最集中的改进选择。' },
          { value: '10.9%', label: '希望增加题量', detail: '27/247，部分用户需要更高练习密度。' },
          { value: '2.4%', label: '希望减少题量', detail: '6/247，说明不能用单一节奏覆盖所有家庭。' },
        ],
      },
      {
        title: '直播需要更高效、更聚焦',
        color: '#5B7BBF',
        items: [
          { value: '28.7%', label: '希望改为高效讲解视频', detail: '71/247，学期时间冲突是首要问题。' },
          { value: '18.2%', label: '希望增加题型讲解', detail: '45/247，用户需要更多方法与错题解释。' },
          { value: '10.5%', label: '希望增加互动带练', detail: '26/247，直播价值应更多体现在现场练习。' },
        ],
      },
      {
        title: '续购用户重视老师关系',
        color: '#4BA69E',
        items: [
          { value: '67.6%', label: '希望原老师继续带班', detail: '69/102，老师连续性有助于保留信任。' },
          { value: '32.4%', label: '老师可更换但必须及时反馈', detail: '33/102，服务标准比个人绑定更基础。' },
        ],
      },
    ],
    actions: [
      '用入营与结营测评、错因变化和进步报告强化效果可见性。',
      '提供基础、标准、加练三档任务量，并设置每周缓冲日。',
      '将直播改为短讲解、错题专题和互动带练，同时保留可回看内容。',
      '保持老师连续性，并建立及时反馈、问题解释和下一步建议的标准化服务。',
      '对 23.9% 的跨专项需求承接应用题、思维和几何专题。',
    ],
    caveat:
      '本页来自结营后主动填写问卷的人群，可能高估整体满意度；原因路径允许同一用户重复出现，开放题提及量也不等于总体发生率。交叉结果仅表示变量相关，不证明因果，也不能替代真实业务续报率。',
  },
];

const satisfactionTheme = BASE_CALCULATION_INSIGHT_THEMES.find(
  (theme): theme is SatisfactionInsightTheme => theme.id === 'satisfaction',
);

if (!satisfactionTheme) {
  throw new Error('Satisfaction insight theme is required');
}

export const CALCULATION_INSIGHT_THEMES: CalculationInsightTheme[] = [
  ...BASE_CALCULATION_INSIGHT_THEMES,
  {
    layout: 'satisfaction-voices',
    id: 'satisfaction-voices',
    tab: '用户原声与总结',
    eyebrow: '06 · 开放题定性洞察',
    title: '用户不满意不是一句“体验不好”，而是五条可追溯的阻力路径。',
    thesis:
      '本页将开放题逐条编码为效果、节奏、难度、服务与价值五类原因。先看跨路径总结，再回到匿名用户原话，帮助团队同时理解“发生了什么”和“为什么发生”。',
    sample: '3月期 · N=247 · 两份表格逐条核对 · 20条代表性原声',
    summaryPoints: [
      {
        title: '效果看不见，是最直接的续购断点',
        detail: '55位用户暂未感知提升，该人群同类计算营明确续购仅5.5%。完成任务不能替代进步证明。',
      },
      {
        title: '节奏问题不是单纯“题量太多”',
        detail: '家庭时间冲突最普遍，同时存在想减量与想加量的两端需求，核心是缺少可选择的任务档位。',
      },
      {
        title: '难度评价向两端分化',
        detail: '偏简单与偏困难同时出现，说明统一内容无法稳定覆盖不同年级、基础和训练目标。',
      },
      {
        title: '服务负向样本少，但破坏力强',
        detail: '老师反馈评价一般的8位用户中，无人明确续购同类计算营，服务感需要被标准化交付。',
      },
      {
        title: '价格异议背后是价值解释不足',
        detail: '用户会把收费与会员已有内容比较，真正需要被证明的是诊断、反馈、加练和结果变化。',
      },
    ],
    dissatisfactionPaths: satisfactionTheme.dissatisfactionPaths,
    caveat:
      '原声均来自匿名开放题，并按代表性与业务意义筛选；加粗内容为语义重点，不改变原意。原因路径允许同一用户重复出现，开放题提及量也不等于总体发生率。',
  },
];
