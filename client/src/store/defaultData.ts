import { VOCItem, ProjectFile, Project } from '../types/voc';

// ── Default VOC items (extracted from 6 user interviews) ─────────────────
// Interview files: 小学物理用研 2026年5月

export const DEFAULT_VOCS: VOCItem[] = [
  {
    "id": "default_001",
    "brand": "洋葱",
    "text": "当时不是觉得那个就是低年级的话，不是得需要计算，得需要有一定的这个一打基础，然后我就给他报了一个洋葱的那个计算的那个有个打卡营。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "选课逻辑",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_002",
    "brand": "洋葱",
    "text": "他就说这个太简单了，因为我当时我看着他那个计算营的那个内容是有点超前的。就是他相当于是那种有点超前学的那种性质，我就想给他那个就相当预习一下嘛。然后他就说那个太简单了，就是兴趣也不是很很大。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容难度",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_003",
    "brand": "洋葱",
    "text": "当时我看的那个，有个就是那个，他们那个就是我们那个学习群里说建议直接报两期，我就直接报了两期，结果报了之后发现反正没有想象的，那么对我们来说可能没有想象的那么有用吧？",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "续费决策",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_004",
    "brand": "洋葱",
    "text": "我觉得一共就21天嘛？然后一期，然后那个当时我看的那个，他们那个学习群里说建议直接报两期，我就直接报了两期，结果报了之后发现没有想象的那么有用，这两个是一块报的，然后第二期我已经好长时间了，我不知道还能不能退，要能退的话我就退了。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "退费意愿",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_005",
    "brand": "NB虚拟实验室",
    "text": "我给他弄那个NB实验室，他有一些现象会，他会给你比较直观的能够表现出来，然后大概了解一下，就是不是说让他为了让他学习这个提前学什么的，不是为了让他干这个啊。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "直观呈现",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_006",
    "brand": "万物指南",
    "text": "就是可能这对于我们家长跟他解释的话，可能有的时候不一定那么的正规，或者表述不一定那么的准确。但是让他通过这些比较，人家已经你像这个万物指南里面有一些，它都是一些教师团队，或者是他专业的团队做出来的一些内容，包括一些，这个他可能会就是更准确一些。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "专业性信任",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_007",
    "brand": "万物指南",
    "text": "让他了解一下，就是有一些自然现象，他为什么他小孩不是有的时候可能会问吗？然后这一类的可能会有一些比较直观的，包括我给他弄那个NB实验室，他有一些现象会比较直观的能够表现出来，然后大概了解一下，就是不是说让他为了校内学习提前学什么的。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "好奇心驱动",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_008",
    "brand": "万物指南",
    "text": "我就觉得他可以大概了解一下，有个概念就行。不是为了提前学什么，更多是让他了解一下自然现象，他小孩不是有的时候可能会问吗？然后这一类的可能会有一些比较直观的内容，包括一些，这个他可能会就是更准确一些，对于我们家长跟他解释的话可能有的时候不一定那么的正规。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "认知启蒙",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_009",
    "brand": "妙懂",
    "text": "第一个买的是妙懂，因为当时没有什么了解，因为当时好多宣传就买了。然后买了之后发现后来好多，当然我也没仔细研究，好像是身边就是有人说一般，就我说实话也没怎么看过，只是当时买了，当时他就说要下架了，就买了，但是他们后来又说一般，然后我就也还没有去怎么看。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "冲动购买",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_010",
    "brand": "妙懂",
    "text": "当时他就说是永久有效。特点，反正就大概就是想，就是。说实话也他也没有什么特别的，当时他的宣传的点就是永久有效。买了好久了，到现在就是孩子一眼都没看过。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "永久卡驱动",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_011",
    "brand": "妙懂",
    "text": "没给孩子看。我就大概点开了他，当时我就想我大概先了解一下，然后我觉得好的话再给他看。然后我自己都还没怎么看，然后我还没给孩子看。对，反正就是他们就是评价说一般，也没有说不好，反正就一般。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "搁置未用",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_012",
    "brand": "NB虚拟实验室",
    "text": "刘斌实验室是因为我当时觉得他那个操作比较方便一点，他演当时演示的操作看上去比较直观的样子。可以操作，然后它因为它那个可以直接触屏，然后就是它的所有的实验都可以通过这种触屏来模拟实验。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "交互直观",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_013",
    "brand": "NB虚拟实验室",
    "text": "后来又觉得他这种模拟实验其实跟你实际做实验的话，他是有差距的。他也不能完全的，他只是模拟那个动画场景。但是他不是，他跟你当时你做实验的那种真实的这种感受，他是还是有很大区别的。只能说是让他大概了解一下这个过程，但是不能代替这个实验。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "缺乏真实感",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_014",
    "brand": "NB虚拟实验室",
    "text": "我当时看它NB的那个介绍，然后比较吸引我的就是有一些比较危险的一些实验，可以在比较安全的这种情况下能让孩子了解到。我觉得NB它就是这种线上的这种表示，就是它比这种纯视频的能好一点，能有一点参与感。但是它又不能表现出真实的场景，它是有一定的差距的。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "安全实验",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_015",
    "brand": "NB虚拟实验室",
    "text": "我当时买那个NB的时候是因为一个是它是也是永久的。然后觉得就是反正就是放，那就是时时不时的，如果需要了，就是因为它的那个内容，包括一些高中的实验内容，是初高中的实验内容都有。我就想着，反正他永久的就放在那，以后万一要是想看看的话可以点点。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "长期囤课",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_016",
    "brand": "万物指南",
    "text": "万物指南的话，是，也是从我们有个学习群，大概就是看了一下这个介绍觉得他这个团队还是比较靠谱的。他不是个什么不刷题的吴姥姥吗？他就说因为他应该是有，他也是之前买过妙懂，然后他就说这个比妙懂好。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "口碑推荐",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_017",
    "brand": "万物指南",
    "text": "就反正就是感觉可能专业性上各方面，他就觉得比妙懂要更专业一些。然后设计上还有包括他后边那些，他这个的话不是那种单纯的让你了解一下，他后面是跟着题的，他每个题都是相当于是那种题库，你大了以后，包括上初中了以后都还能用。就是这种，而且还是永久的嘛。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "题库配套",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_018",
    "brand": "万物指南",
    "text": "他后面的那个题的话，就像你们，跟你们洋葱有点像的，就是他后面的那个题，他不是像视频一样给你放过去，他是让你就是点，然后有对错，然后错了是怎么错的，后面会有这个解释。就是这种形式。我觉得就是还是他后面的这个题很好。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "即时反馈",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_019",
    "brand": "学而思",
    "text": "实验课是学而思的。就叫自然博物和物质博物。一个是物理和化学的。孩子喜欢，因为他就是玩呀。对，就是他喜欢，然后你就不用，就是他兴趣，有兴趣的话你就不用怎么说，然后他就会主动地去做。他自己要求的，他自己要求报。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "激发兴趣",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_020",
    "brand": "学而思",
    "text": "它是一个线上的，但是它有实验的道具教具。就是科学课。自然博物它现在已经没有了，已经不做了，因为这个课它不挣钱。反正就已经没下了。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "课程停运",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_021",
    "brand": "NB虚拟实验室",
    "text": "包括我给他弄那个NB实验室，他有一些现象会，他会给你比较直观的能够表现出来，然后大概了解一下，就是不是说让他为了让他学习这个提前学什么的，不是为了让他干这个啊。就是可能这对于我们家长跟他解释的话，可能有的时候不一定那么的正规，或者表述不一定那么的准确，但是让他通过这些比较专业的内容了解。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "现象直观呈现",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_022",
    "brand": "洋葱",
    "text": "你们洋葱的那个视频好多那种啰里啰嗦的这些东西，反正就感觉就不灵的东西太多，太浪费时间。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容冗余",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_023",
    "brand": "洋葱",
    "text": "我当时想看来着，他点不开，那个大会员里边不包括这个。那当时那个大会员也是那个开的时候，当时跟我说这是小学的所有内容都能看。结果发现他那个什么就是什么期末复习，什么规划，什么黄子，那些都废，然后我就退了。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "会员权益",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_024",
    "brand": "洋葱",
    "text": "既然你说了都能用，然后结果点这个收费，点那个收费。然后就感觉这个你让感给我的感受不好，说实话我买其他的东西也是几千的，也花了。你，我买你这个洋葱也是花了好几千的。然后你再跟我说这个收200，那个收300，然后我就觉得，哼，就是有一种上当的感觉，你知道吧？",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "定价透明度",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_025",
    "brand": "万物指南",
    "text": "物理十分通里面非常的简洁明了，他就是说的没有过多的废话。因为他这个东西你总不能以永远都以一个低幼的一个儿童的一个视角去看待这些东西，他早晚他得适应这个课堂，他在课堂上的老师是以这种讲课的形式，不是这种玩乐的形式。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "内容质量",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_026",
    "brand": "万物指南",
    "text": "我觉得吴姥姥既然他比较靠谱，他也不会去找不靠谱的团队合作吧。因为她，我觉得她这种已经荣誉加身的人，比较爱惜羽毛一点。我觉得他既然物理能做好，他化学肯定也能做好。我化学连看都没看就买了。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "IP信任度",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_027",
    "brand": "万物指南",
    "text": "它不光是看的视频，它还可以点开，把这个藏品点开看它的细节，哪个地方的纹路？哪个地方有磕碰？哪个地方的什么都能看得到？从那个视频上可以把它放大，正反面都可以看，就相当于你在博物馆里，你去博物馆的时候你是看不到的，因为它有个玻璃挡着。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "互动功能",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_028",
    "brand": "万物指南",
    "text": "它的质量是比较高的，包括它的一些跟它的那个博物馆的那些藏品，非常的高清拍的，它是都是有授权的，它是可以有一些不能展出的一些藏品，它是可以进去拍的，它这个肯定它是有官方的背书才能达到的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "内容权威性",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_029",
    "brand": "万物指南",
    "text": "它那个1 APP里面，你进去以后它就只有这三个。因为我就想把它放在一个里面，就是都比较方便一点嘛。你要是不买的话，它点到那它点不开，它会问你要。所以我就一块把三个学科都买了。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "产品捆绑",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_030",
    "brand": "NB虚拟实验室",
    "text": "NB实验室，它是一些实验性的东西。他没有那些具体的，他只是说是他里面都是一些实验，他没有，他除了实验之外的东西他是没有的。他是可以搭配着用的，我觉得。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "功能定位",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_031",
    "brand": "洋葱",
    "text": "当时它宣传的是你小学的内容，全部都包括了。是那个的，但是那个就那个，我一看还有因为那个还要收费。然后我就觉得那可能其他的地方可能也有还要收费的地方。感觉你可以收费，你可以另外收费。但是你得告诉我。我就觉得这个不坦诚，对我。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "信息不透明",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_032",
    "brand": "洋葱",
    "text": "你们这个就是包括销量也好还是什么这个会员数也好，可能是这个东西的话，我说了我们不了解。我的就是，可能我周围的人说实话，除了我以外，其他人都没用过洋葱。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "品牌认知度",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_033",
    "brand": "洋葱",
    "text": "我买计算营之前的时候买过，我是很早之前的时候就退了，洋葱的那个大会员。然后我这个计算营，我只是一个，就是当时觉得我就看看他这个计算营是一种什么形式的。然后看那个就是不了解这种计算营的形式，没有，从来之前没有接触过这种计算营，我想看看是什么形式的。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "尝鲜试错",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_034",
    "brand": "洋葱",
    "text": "做了一期之后发现这个形式就是怎么说呢？就是比你自己让带着孩子的话稍微有稍微省事一点，但是省不了太多，所以就是也不打算再那个啥了，再跟了。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "家长减负效果",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_035",
    "brand": "洋葱",
    "text": "单纯从这个命题人来说的话，我觉得不一定，我不一定会因为背书来去选择。因为我觉得每个地区的命题，它对中考来说的话，它不一定地域，它地域很明显。山东地区的和河北地区的，虽然它用的同样的教材，但是这命题这个各方面可能特点就完全不一样，你像这些教辅书它都分地域。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "地域适配性",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_036",
    "brand": "妙懂",
    "text": "我我我有了妙懂了，然后我发现有比它更好的，我也会买那个物理生分通。但如果你说你通，你确实比那个物理生分做得更好，那我以后我也会考虑，因为他毕竟现在还没有正式学，对吧？",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "现有产品满意",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_037",
    "brand": "妙懂",
    "text": "那起码你得真的做到比他好很多才行，因为我毕竟已经有这么多了，对吧？我要是你要是说差不多或者是好一点不明显，那我也没有必要再花个，多花，那么。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "竞品对比门槛",
    "sourceFileId": "default_file_1",
    "sourceFileName": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_038",
    "brand": "NB虚拟实验室",
    "text": "然后我一看这个终身制的。然后的话才不到2000块。他比如说寒暑假我可以给咱找。完事呗。他可以把下个学期的可以玩一玩，上学期的再复习一下。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "性价比高",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_039",
    "brand": "NB虚拟实验室",
    "text": "他的每一个实验我觉得他做得很细，包括他生物，他那个鸟类的结构，鸟的结构，他的图画。就挺精细。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "内容精细",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_040",
    "brand": "NB虚拟实验室",
    "text": "没有，它主要是它那个那些实验。它是自主性，它可以自己开发那些稍微试剂去。自己去组合嘛。这个对于他来他觉得挺有意思。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "自主探索",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_041",
    "brand": "NB虚拟实验室",
    "text": "您看那个，比如说到初中、高中。他这个做实验。那你一个班级上，每个班级可能比如说四五十人。你是不是这个做实验的频次你可能就达不到了。你时间上，你课程上的安排不允许，你在家玩虚拟实验，你什么时候都可以玩。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "灵活使用",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_042",
    "brand": "NB虚拟实验室",
    "text": "我觉得NB能满足，因为它跟着教材来的，你不管你是北京的教材还是哪个教材，它都有教材的版本可以选择。他还有知识闯关专题视频，它里边剩下的要课本全实验、全覆盖。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "教材同步",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_043",
    "brand": "NB虚拟实验室",
    "text": "通过实验打这个他的知识点的基础嘛。打得更牢一点，而不是说像科思维的话也比较枯燥，通过理解比较枯燥，理解方面有一点的这个难度。你做实验的话就更直观的感。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "直观易懂",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_044",
    "brand": "NB虚拟实验室",
    "text": "平时可能时间上来不及，因为全贡献给主科了。频率不高，我不就只用寒暑假吧。寒暑假每天都要看实验，那知识闯关、刷题这些可能不高。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "使用频率低",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_045",
    "brand": "学而思",
    "text": "学而思科学的话3.5分吧。就是打比赛这一块。当时买的时候不知道他后面还有一个需要再多加额外的这个费用的这样的一个事。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "隐性收费",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_046",
    "brand": "学而思",
    "text": "他前边铺垫了很多的，说了很多的理科的打基础吧。包括以后国家关于理科人才的培养。家长这一方面需要关注的。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "营销话术",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_047",
    "brand": "学而思",
    "text": "也没有更喜欢哪个，当时他说这个老师不教的时候，他就也理解，也就没有继续要求我必须要学习了。孩子还是很认老师的，他如果这个老师不教他了，他完全是就可以说自己自主，就说我可以不学这个了。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "师资依赖",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_048",
    "brand": "洋葱",
    "text": "咱们洋葱，洋葱，咱报的是全科的这个大会员，是吧？我在那个模块上好像看见过从小学物理。那个好像是单付费的吧。目前没有点进去看。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "付费模式",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_049",
    "brand": "NB虚拟实验室",
    "text": "没有他，以后就我玩人力实验室的，玩是终身的。他一个号，俩人一块学呗。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "长期使用",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_050",
    "brand": "NB虚拟实验室",
    "text": "我已经买了那个NB了，我不能再买一套走呀。可能也同时知道的，但是我看NB的直播间比较多，然后包括我老看那个学霸三人行那个直播间嘛，然后对这个直播间的主播推荐的还是比较有倾向性的。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "直播种草",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_051",
    "brand": "NB虚拟实验室",
    "text": "肯定是学习兴趣越来越浓吧。他前期肯定也有那个学而思科学的铺垫，打的基础，后来转的NB，然后慢慢对理科这个感兴趣。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "兴趣提升",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_052",
    "brand": "妙懂",
    "text": "知道这个，但是没细看了，因为你选了一学科分，选了一项就不能选两项。我已经买了那个NB了，我不能再买一套走呀。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "竞品放弃",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_053",
    "brand": "学而思",
    "text": "他前期肯定也有那个学而思科学的铺垫，打的基础，后来转的NB。三年长期下来，学而思跟NB前后，对这个物理书的兴趣度发生了变化，孩子对理科感兴趣了。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "基础铺垫",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_054",
    "brand": "洋葱",
    "text": "有吸引力，因为孩子平常挺愿意看洋葱学园的这些课的。因为我前一段时间又报了一个咱们洋葱的那个计算21天打卡，一共打了42天。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "持续参与",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_055",
    "brand": "洋葱",
    "text": "好，做的确实挺好。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "整体评价",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_056",
    "brand": "NB虚拟实验室",
    "text": "买的产品是好的，但是你自己家的孩子有多少时间去消化这个是自己家的问题，对吧？产品是没有问题。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "产品质量",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_057",
    "brand": "学而思",
    "text": "科学课是非常贵，因为它有教具，尤其学而思的科学课也挺贵的。所以的话可能家长就对它有更高的需求，但是因为它很贵，所以也是很高的门槛，就很多低线家长是不会买的，就一般都是一新一线的家长才会买科学课，因为它很贵嘛。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "价格门槛",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_058",
    "brand": "学而思",
    "text": "他这个小孩从一年级报的课报的学而思，对那一年级他都有学科启蒙的诉求了。",
    "sentiment": "neutral",
    "dimension": "启蒙认知",
    "subDimension": "低龄启蒙",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_059",
    "brand": "妙懂",
    "text": "重点找一下1到4年级的妙懂的家长。现在约了3个用户，目前都加了微信，是三年级左右的妙懂，因为我们现在没有妙懂的人可以去聊一下。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "目标用户",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_060",
    "brand": "万物指南",
    "text": "我们真的比那些纯启蒙的这种科学课也好，这种大百科是什么、十万个为什么等等，就这种是兴趣来说，我们是有学科属性的，而这个学科属性怎么证明我们有学科属性？这个是我们如果要喊学科启蒙这个点的话，我们现在欠缺的东西。",
    "sentiment": "neutral",
    "dimension": "启蒙认知",
    "subDimension": "学科属性",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_061",
    "brand": "万物指南",
    "text": "学生能在这里收获什么？我们需要把它外化出来。也不要讲小初衔接那么重，因为发现大家对于做题这件事情并不是很感兴趣，这两个家长都不是很感兴趣，就起码对于做题这件事情没有很大的诉求。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "学习产出",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_062",
    "brand": "万物指南",
    "text": "我们可以做一个比科学课更便宜，且我们学科启蒙效果更好，然后对象是比如2到4年级这种，甚至是1到4年级，一年级也可以。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "价格优势",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_063",
    "brand": "万物指南",
    "text": "家长可能越来越对于学这东西不能只是一个兴趣，只是一个兴趣花2000多块钱可能觉得不值，毕竟是科学课，还是挺贵的。家长就对它有更高的需求，功利型家长的有用论——学什么东西要有用，对我未来学科有用。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "功利导向",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_064",
    "brand": "万物指南",
    "text": "如果真正做到学科启蒙能给他讲出来更多的，比如说知识概念之类的、原理之类的东西，他能了解，孩子能说出来他应该会更满意，只是现在竞品都没有做到，或者没让他看到而已，所以他觉得不知道就是对。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "效果感知",
    "sourceFileId": "default_file_2",
    "sourceFileName": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_065",
    "brand": "洋葱",
    "text": "因为他说素材可以从生活中随手，可以随时可以找到。然后就可以提前对那个物理启蒙。因为以后到初中也会学到物理，然后可以提前让他认识知道一些就是跟物理相关的知识。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "购买动机",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_066",
    "brand": "洋葱",
    "text": "因为它是终身的。买了之后我就可以慢慢学，现在可以，以后也有，也可以回放看这种。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "终身权益",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_067",
    "brand": "洋葱",
    "text": "他很少主动去看。有时间就带他看看，但是我们没有一个规划是固定一个时间去学这样子的，就是有时候偶尔这段时间有空我打开去看，他就跟着我看。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "学习主动性",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_068",
    "brand": "洋葱",
    "text": "从小学物理，它是全部内容已经开放给你看了嘛，所以就没有那种动力去一个个去完成这样子喽。不像那些课每天更新，他就比较有那种动力，每天完成它就完成，老师每天有一个目标。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "学习动力",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_069",
    "brand": "洋葱",
    "text": "让他多坚持，好像有基本上一个星期学两三次这样子，可以慢慢地接触一下就是生活中的物理，提前为那个初中打一下基础。",
    "sentiment": "neutral",
    "dimension": "启蒙认知",
    "subDimension": "学科预热",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_070",
    "brand": "洋葱",
    "text": "因为它比较贴近生活，所以对我们来说可能就是做实验的材料什么的那些比较简单。可以动手，自己动手去发现、去体验了。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "动手实验",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_071",
    "brand": "洋葱",
    "text": "在微信那个鸭妈那个直播，她比较推荐，我们可以让孩子去从生活中慢慢接触一下物理，这样子让他们学一下喽。然后没有再去其他地方了解，就是直接在视频号里面下单了。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "渠道转化",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_072",
    "brand": "洋葱",
    "text": "我们上的课不多，所以暂时感觉影响不大。没有达到一周学两三次的目标，没有一个规划是固定一个时间去学，其他网课还没上完，所以洋葱这个一直没有正式开始。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "使用频次",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_073",
    "brand": "洋葱",
    "text": "可以动手，自己动手去发现、去体验了。让他动手去自己利用那个做小实验，可以更具体地去知道这个物理是怎么回事嘛，因为生活中也处处都有物理现象。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "动手实验",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_074",
    "brand": "洋葱",
    "text": "可能还要学的东西太多了。他校是每个星期每天都要学的，晚托8点钟放学回来，学了校阅读跟思维，学校里面还有一点点作业，基本上就没时间上其他课了。周末要跳舞、练字，可能也要做学校的作业，剩余的时间就很少，所以就很少有空坐下来去学这个小学物理。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "使用频率",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_075",
    "brand": "洋葱",
    "text": "也没有说它不好，只是我们可能没有坚持去上它，没有用它而已。目前整体只看了两三节，我们最初预期是一周能看个两三节，中间是有一些落差的。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "坚持使用",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_076",
    "brand": "洋葱",
    "text": "就是到等到他真正学物理的时候，他可以大概知道了，不至于一点都不懂，比其他同学的话就可以提前知道一些东西，他就可以到时候更加好吸收老师讲的。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "学科预习",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_077",
    "brand": "洋葱",
    "text": "因为他喜欢的话他会自己去看、去了解的，但是有时间他也不会打开那个去看，他宁愿打开其他的。他不太感兴趣。其实我最终的目的是培养学科思维，但首先是从兴趣开始，然后到动手，然后到学科思维，慢慢一步一步来。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "兴趣激发",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_078",
    "brand": "洋葱",
    "text": "说很需要那些地理、生物课程的话就没有，但是我觉得应该在大会员那里开放给大会员可以看那些内容就更好了，因为几千块钱买的会员，有时候想看也可以。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "会员权益",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_079",
    "brand": "洋葱",
    "text": "到了三年级以上，学业比较重，你很难顾及全科的。如果我们三年级之后能把从小学物理坚持每天学已经很不错了，如果再开发地理生物有历史那些，时间没时间了，不是不想学。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "学习时间",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_080",
    "brand": "叫叫",
    "text": "他从幼儿园大班开始学叫叫阅读，每天要打卡，如果不完成的话都会提醒让你去上，所以他就习惯了，养成了每天都学叫叫。他放学回来基本上自己就会拿着学习机去学叫叫，不用提醒的，觉得很自觉。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "习惯养成",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_081",
    "brand": "叫叫",
    "text": "有时候每个月会搞一些活动，你学满了之后分享到朋友圈截图上传就可以得到小礼品，或者是叫叫里面的人物可以添加皮肤装扮，也是奖励，给他们激励去学习。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "激励机制",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_082",
    "brand": "叫叫",
    "text": "老师会发那种电子奖状，说你是什么之星，感觉小孩子就觉得自己很有成就感了，然后他就会自己主动地去学。小孩子肯定喜欢，奖励礼品给他就是很好的激励。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "成就感设计",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_083",
    "brand": "叫叫",
    "text": "今年的课也不报了，我们打算是主攻洋葱那个语数英，就是大会员里面的跟校内同步的那些内容。叫叫也是启蒙而已，后续会减少叫叫的投入，主要精力放在校内同步学科上。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "续课意向",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_084",
    "brand": "洋葱",
    "text": "因为我们不是还有一个买了你们的会员嘛？有时候我也会带他看一下你们洋葱的英语。物理那个就还没接触到，所以就想先帮他先把英语、其他学科先学好，物理这些就真的是有时间有空坐下来就看一下这样子。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "多科使用",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_085",
    "brand": "洋葱",
    "text": "洋葱会变成主攻的了，就是主要学你们里面的内容。打算主攻洋葱的语数英，就是大会员里面跟校内同步的那些内容，后续把更多时间放在洋葱主课上。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "主课依赖",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_086",
    "brand": "洋葱",
    "text": "几千块钱买的大会员，我个人觉得应该在大会员那里开放给大会员也可以看从小学物理、地理、生物那些内容就更好了，这样才觉得大会员的权益更值。",
    "sentiment": "negative",
    "dimension": "购买决策",
    "subDimension": "性价比感知",
    "sourceFileId": "default_file_3",
    "sourceFileName": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_087",
    "brand": "洋葱",
    "text": "他自己会学习洋葱学园里边的从小学物理，这个就是他自己，就是自己会翻，然后学的特别多。如果我因为我都是强制定时的，因为他视力不是特别好。就是我经常性的就是自己定了15到20分钟之后，他还会往下串表，就会自己就会学。对，特别喜欢。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "自主学习",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_088",
    "brand": "洋葱",
    "text": "洋葱学园的，从小学物理，如果说我不是不管的话，他每天他都会刷。但是我会管他。他相较于学这个，从小学物理会，有时候，更多时候会胜于学这个数学。他好像特别喜欢看那实验男做实验。他当成趣味里边学知识了。确实是很喜欢。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "内容趣味",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_089",
    "brand": "洋葱",
    "text": "他之前是涵盖在这个，就比方说小学阶段，他不分阶段，小学阶段里边，物理是包括的。然后我买的时候，这个从小学物理后来改名更名了，它就不包括了，不包括需要单独付费的，我是基于我们家孩子喜欢，我才付费去买这个课程的。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "付费动因",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_090",
    "brand": "洋葱",
    "text": "我主要是看中他这个理科的同步校内，然后，诶他这个小学从小学物理，看他那实验做得也比较好，然后孩子看了也很感兴趣，我才又添加了这笔钱买的从小学物理这个课程。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "实验质量",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_091",
    "brand": "南开大学AI物理课",
    "text": "孩子看了之后也跟你们这个洋葱的从小学物理会进行对比，因为那边就是说涉及到的AI比较多，然后动画也不如我，就是你们这边洋葱做的吸引人，所以孩子更喜欢就是洋葱这边的，从小学物理，去学习这个物理知识，对哪边有点晦涩，更晦涩。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容晦涩",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_092",
    "brand": "南开大学AI物理课",
    "text": "AI物理课我没报，就是我没去专门报，因为我是AI的小象，AI的学员。就是然后他们又同步出了AI的物理课，让我们这些AI学员进行体验。所以我会知道有这个AI物理课。孩子看了之后也跟你们这个洋葱的从小学物理会进行对比。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "体验转化",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_093",
    "brand": "NB虚拟实验室",
    "text": "NB实验室应该是在买洋葱之前，因为我看了一下，你们就是购买你们洋葱的订单是在26年的1月10号左右购买的洋葱。NB实验室很早了，因为现在NB实验室已经不是永久的权限了，我当时买的时候还是永久。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "购买时机",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_094",
    "brand": "NB虚拟实验室",
    "text": "NB实验室确实利用率目前来讲还没有得到更好的，就是说这个已优化，但是孩子也是感兴趣的。利用率不是很高，NB的实验室。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "使用频率",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_095",
    "brand": "洋葱",
    "text": "洋葱的紧贴校内，根据课程培优，这个还是很适合当下孩子的学习的，所以现在是主要是学这个洋葱的话里边有的时候因为我们每天都有练计算、口算，还有应用题的话也会有一些测的。遇到不会的难点，会返回到洋葱学园搜索关键词，再同步找到匹配的知识点，进行答题，进行知识讲解。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "同步校内",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_096",
    "brand": "洋葱",
    "text": "因为他是当时推的时候，从小学物理，我昨天也说过了，就简短时间。他之前是涵盖在这个，就比方说小学阶段，他不分阶段，小学阶段里边，物理是包括的。他说了这个课程就是早买早享受，之前早买的话是涵盖这个内容的，但我现在没有了，但是我也需要，所以我就买了。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "权益变更",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_097",
    "brand": "洋葱",
    "text": "我不是主动要买这个物理这个课程，我就是看他有，我就确实是拍了，因为也像说我确实也注重孩子的这物理启蒙这一块，所以可以说我觉得不错，性价比也很高。这就是我购买从小学物理的最初这个动机。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "冲动购买",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_098",
    "brand": "洋葱",
    "text": "因为它的展现的形式的话，孩子喜欢这种动画形式的。孩子感兴趣就是第一要素，他如果说有兴趣，其实现在包括看到的效果，他自主能学习。课程设置内容也比较丰富，然后产品形式包括也很多样，也是不断在更新的，买这个课程性价比又高，然后孩子又喜欢，一些内容上又能查缺补漏。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "内容丰富",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_099",
    "brand": "洋葱",
    "text": "不用对比，就是说性价比的话，就直接下单开通，孩子学了一次，他就喜欢。因为也是了解自己孩子这个方面，这也是从小学物理应该我买到他不也是说的终身的权限。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "高性价比",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_100",
    "brand": "洋葱",
    "text": "从小学物理的知识好像更多更系统，更多NB实验室来讲。孩子静下心来去做，在那去看，从小学物理讲这个概念，趣味性的概念，他投入的就是专注力更多，注意力会更吸引孩子吧。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "知识系统",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_101",
    "brand": "洋葱",
    "text": "他那模块的内容方方面面，知识的话讲解也会比较多，系统性更强，因为它都已经罗列得非常分层次，看得也比较清晰，孩子也能自行选取他喜欢什么，他也可以能随机点取，可能自己的选择性更强了。一个视频几分钟的时间也不会占用太长的时间，学完了很吸引孩子，再往下去再看另一个小视频。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "自主学习",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_102",
    "brand": "洋葱",
    "text": "您要单从这方面，如果说洋葱后期能增加更多的实验的元素的话，那肯定是锦上添花了。如果说现在没有的话，那可着现在有的从小学物理课程看，我们也不亏，因为他已经涉及的很有趣了，孩子也喜欢，我们可以从其他方面补足，这个不是我现阶段主要担心的。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "实验缺失",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_103",
    "brand": "洋葱",
    "text": "还是从小激发这个物理的学习兴趣，也能不排斥以后，因为以后有更高的，毕竟升学需求，考试科目的选取，还是不想让他之后对理科失去兴趣，所以抓住从小应该掌握这个理科的黄金期，让他去早早的有所渗透，然后也能多长长见识，在生活当中也能实际得到运用，把知识运用到实际生活当中。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "兴趣培养",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_104",
    "brand": "赛先生科学课",
    "text": "我们有在上线上的小班的科学课，就是赛先生科学，这科学课是上了两年了，从L2开始上的，就是在他大班的时候也就是5岁，就已经开始这个小班的科学课，是一周一节，每周日上课一节课是一小时，就线上跟着老师，主要是动手说做实验，这是上海那边开发的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "长期使用",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_105",
    "brand": "赛先生科学课",
    "text": "我们线上主要是真人直播，又是小班的科学线上的科学课，除了讲解的话他还会线上做实验，还有线下匹配的一些手册去练习。他肯定是更全一些，因为他有老师，有真人活人感在授课，都是小班，老师也能照顾过来，我们家孩子又很积极，在课上积极发言，他吸收到的也会很多，课下我也会带他去复习，知识的话就会理解得更透一些。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "师生互动",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_106",
    "brand": "赛先生科学课",
    "text": "当你在做实验，就是当孩子在做实验的时候，遇到问题老师是可以知道，就是因为直播可以看到，及时地指出这个问题，然后孩子也会发现自己做的有问题，他会及时纠正过来的，对，这个效果肯定是会更好的。所以我觉得一定要有专业的老师带着去做实验，效果会更好的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "实时纠错",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_107",
    "brand": "NB虚拟实验室",
    "text": "NB实验室也有这方面，但是他可能会因为没有讲解，没有辅助，主要是更多的是自己去线上的动手操作这个实验，家长在旁边会多一些。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "家长参与",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_108",
    "brand": "NB虚拟实验室",
    "text": "NB实验室是属于自己有这个工具软件，因为我会控制它时长嘛，就是人为干预，它可能会使用频率低。看得出来孩子是想用的，但我要控制时间，所以实际用得不多。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "使用频率",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_109",
    "brand": "NB虚拟实验室",
    "text": "从小学物理的知识好像更多更系统，NB实验室来讲，因为学的使用率少。然后我们线上的话，它主要是以动手操作实验为主，它也会，老师也会刚开始介绍一些物理方面的概念知识讲解，但是不如孩子静下心来去做，在那去看从小学物理讲这个趣味性的概念，专注力更多。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "知识深度",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_110",
    "brand": "学而思",
    "text": "我还有一个课程，这是跟学而思的，自然博物，它也是涉及一些自然，就这些都不分家。是北大的博士老师讲的，也是直播课，不过是大班的，方方面面自然博物，比方说是地质了、自然了、科学了，像这种他都有涉及，我们也都上下来，全程都上完了，应该是12个阶段，这模块都已经上完了。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "课程完整",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_111",
    "brand": "洋葱",
    "text": "要是10分满分的话能有9分，因为他确实是，如果说占比全也是刚才我们反复提到的实验那个点，他这点是比较就是还是有待提升的。一分的话就是说余额给到他以后的晋升空间。其他方面做的还很好的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "综合评分",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_112",
    "brand": "洋葱",
    "text": "就是他在视频里面介绍，很多时候有一些对孩子来讲，因为我们家小低阶段一些晦涩难懂的一些概念词，孩子还是不能很好的理解，如果说这个概念同步出来的话，再根据这个概念进行口语化，或者是孩子能接受的方式进行一些举例去介绍这个专业性的概念的话，孩子能理解更好一些。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容易懂性",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_113",
    "brand": "洋葱",
    "text": "动画做的一直是你们的优势，做的是很好的。孩子喜欢，有人带着他学，就是给他讲，他也喜欢像听故事一样去听，然后他调动他五官，他就感兴趣。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "动画品质",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_114",
    "brand": "洋葱",
    "text": "唯独这个课我就很放心，比方说我忙，我做饭的时候可以把这个时间完全的交给他去弄。他学了很多，都是100%的进度条，他去自己学，他那后面答题有的时候正确率也挺高的。也是基于我对你们产品的信任。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "自主学习",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_115",
    "brand": "洋葱",
    "text": "他看了之后他会考我，哎，妈妈，你知不知道怎么样？这个功率怎么用？多少电？他就会把课上看的从小学物理那个视频，他会转化他自己的语言，他学到了他就会跟你去分享。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "知识转化",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_116",
    "brand": "洋葱",
    "text": "就是说孩子他喜欢，列的也是比较细致，这个点、面都介绍得比较全。知识的话就是系统性更强，因为它都已经罗列得非常分层次，看得也比较清晰，孩子也能自行选取，他喜欢什么，他也可以能随机点取，自己的选择性更强。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "课程体系",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_117",
    "brand": "洋葱",
    "text": "这个答题环节能增加读题的功能也更好。有时候这个字不认识，如果说这个答题环节能增加读题的功能也更好。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "功能改进",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_118",
    "brand": "NB虚拟实验室",
    "text": "很多就危险性的实验的操作的话，肯定是在现实生活当中，有些家长就包括于我来讲，我也达不到那么的专业，但是在这个虚拟的环境下的话，可以放心让孩子去做，它不存在危险性，这是它的一大优点。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "安全性",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_119",
    "brand": "NB虚拟实验室",
    "text": "NB 的话他得自己乱拖，他自己有些字他还不认识，然后那实验操作的话，兴许他还做不好。然后我看见他了，也就有的时候我也会批评他，他可能刚提上来点兴趣，可能被我浇灭了。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "操作门槛",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_120",
    "brand": "NB虚拟实验室",
    "text": "我不是觉得它不重要，是因为没有时间，这个时间不够。平时涉及肯定是洋葱这个从小学物理占的块，时间模块是最大的，NB 实验室还有洋葱的话，只能先选孩子选洋葱了，那 NB 我肯定就舍弃了，因为这时间的话不能投入在那上面。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "时间分配",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_121",
    "brand": "NB虚拟实验室",
    "text": "就他更，各有利弊，它也各有优势。这工具我没利用起来，目前阶段。使用频率是最低的，三者里边是最低的。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "使用频率",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_122",
    "brand": "赛先生科学课",
    "text": "线上科学课去当场做实验的话，老师也很讲究这个安全性，确实家长得从旁协助去做这个实验，当做成功的话，全程的参与感很强，也是能激发孩子的动手操作这个积极性，激发这方面的兴趣，他也从实验当中能获得一种满足感。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "实验参与感",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_123",
    "brand": "赛先生科学课",
    "text": "赛先生我是从第一节就每堂课都不落，我是都在旁边都知道的，因为他这个，考察的是老师的专业性，他上课的老师选取的是这方面，他有时候的知识点，有些时候也会存在一定的讲解问题，孩子也会听不懂。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "讲解质量",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_124",
    "brand": "赛先生科学课",
    "text": "可能实验那个方面实验还是挺丰富，因为确实他每堂课都会涉及实验，涵盖的实验内容还是比较多的。也差不多是这个分数，因为他毕竟是直播课嘛，做的时间也是蛮长的了，孩子也是通过上这个课也是学到了不少知识的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "实验丰富度",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_125",
    "brand": "赛先生科学课",
    "text": "引导很多时候那个讲解就包括理论讲解上，孩子不是很明白，他没有用孩子通俗易懂的他理解的话语再去讲解，所以说他不懂包括了伯努利什么，虽然他去做这个实验了，但是孩子还是理解得不够透。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "概念讲解",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_126",
    "brand": "赛先生科学课",
    "text": "因为确实上了，我们上了都两年了，时间也很长，他的启蒙的话肯定是在他学习的过程当中都是有渗透的，都是互相推进的。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "长期效果",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_127",
    "brand": "学而思",
    "text": "我们跟着学而思学下来也是直播课，涵盖的面更大，已经富含了里边，包括人文地理、生物科学全都有的，那都已经学过了。自然博物，跟着学而思学下来也是直播课涵盖的面更大。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "知识覆盖",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_128",
    "brand": "妙懂",
    "text": "听过这个妙懂，我听过，但是没报。因为我当时这个去就时间分布都已经分布给直播课，还有一些其他平时，时间也是满的，所以说就不考虑，孩子的时间有限，线上课程分布都有限，不能光匀出来理科，还有其他包括语文、英语这方面都会得涉及的。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "未购原因",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_129",
    "brand": "洋葱",
    "text": "他课程研发各方面我没去深入地去看，我就知道这个，因为杨同学，这个杨就他也做客直播间，也比较喜欢他这个杨临风。他不也是对他个人，就他展现个人魅力还是挺好的，然后各方面的，当时强大的后备团我觉得还是挺信得过的。就基于这一点，然后其他的就是单就从小学物理，我还没考察那么多。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "KOL信任",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_130",
    "brand": "洋葱",
    "text": "他讲解比较思路比较清晰。而且说他的这一个个人背景的相关就是有一种崇拜。因为都有学霸这个崇拜的心理嘛。在国外，他好像是国外哈佛大学，应该是。名校的光环，就是觉得这个人还是挺信得过的。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "名校背书",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_131",
    "brand": "洋葱",
    "text": "内容因为我没说，我一说容易，因为我容易代入进去，就说这个数学。对，就是物理还是我觉得还是讲得挺丰富的。就是说他课程研发各方面，他讲的就是说还是比较全面，这让一个外行看，确实，对，理科这个就是物理这方面，我确实说的不是像其他的说的那么多。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "内容丰富",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_132",
    "brand": "洋葱",
    "text": "看不对，判断不出来，因为现在他涉及的就是说看你们从小学物理多，他有没学，从小学化学、从小学生物，根本就没法对比。他不像说这三个，假如说你同步出来了，都更新出来了，都有这个课程，然后同步，正好我手里也都有这三个，他去学，我也能从这个时间分配上来判断出他对哪一个更有兴趣。现在的话只是单一的物理。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "学科单一",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_133",
    "brand": "洋葱",
    "text": "我报的时候1月份，1月10号肯定是没有的。就是说现到现在5月份就是过去的将近4个月的时间就已经有了从小学化学和从小学生物，是吗？后期的话我也会关注这个事的，跟住这个事。因为我确实第一我是对教育也是投入比较多的，第二是对理科的话，因为我本身就是不是学理的，我希望孩子不要像我一样。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "课程更新",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_134",
    "brand": "洋葱",
    "text": "就还是当时他有这个链接挂链了，我也需要，就买了。有对比，没有那么多，当时。就基于他信任，然后其他的话都是随缘。没想那么多。真想那么多，那我考察那也耽误时间。你说小孩是有精力时间的大人，尤其这个，事情更多的话，他也顾不过来，确实是顾不过来。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "品牌信任",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_135",
    "brand": "洋葱",
    "text": "我对它这个品牌，我对这个品牌。洋葱的数学做得挺好的，然后这个您之前一直说，洋葱的物理都挺不错的。就是说以后有学科方面更多的选择吧，因为男孩跟女孩毕竟也不一样，还是要希望他能更好地学，从小掌握好理科的思维，各方面的，以后有更多的选择，能学好理科。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "品牌口碑",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_136",
    "brand": "洋葱",
    "text": "通过这个访谈也能就是说听取到我们用户的这种真切的意见的话，后期的话就是说进行改善，然后我们也是确确实实从中就是说能窃取到好处，嗯，孩子也能更好地去学习，这就挺好。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "用户期待",
    "sourceFileId": "default_file_4",
    "sourceFileName": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_137",
    "brand": "NB虚拟实验室",
    "text": "当时就是因为它现在变了，以前的那种界面看着看着很不舒服，很像盗版的APP一样，看着不舒服。然后题的话好像也不是像现在这么丰富，所以我当时退了，但是后面不是我又试用啥，然后发现他们变了，他更新了，然后才买的。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "界面改版",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_138",
    "brand": "NB虚拟实验室",
    "text": "当时比如一年级，我让他看的时候他在看，但是好像没有特别感兴趣。就是然后我问他要不要看，他说要，但是他也感觉他没那么感兴趣，我能感觉到。但是现在看，看的话就是真的还是挺认真的，挺感兴趣的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "孩子兴趣",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_139",
    "brand": "NB虚拟实验室",
    "text": "我给他说的是至少两星，如果你没有，只有一颗星，那你就重做，不懂的话你就回去再看一遍。反正两星过关。就感觉他也不是那么成体系，就感觉就是挺适合给孩子启蒙的那种。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "题目练习",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_140",
    "brand": "NB虚拟实验室",
    "text": "三无小星里面有物理，然后还有那个历史他也要看。物理没看，然后历史的话，物理我给他看了一两节，感觉没有地理历史那么感兴趣，所以说先让他看的是历史，他也挺感兴趣。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "学科偏好",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_141",
    "brand": "NB虚拟实验室",
    "text": "他有一起打包，也有单科，但是单科的买的话就不太划算。我想的是老大不看，就老二会后面再看。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "价格决策",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_142",
    "brand": "妙懂",
    "text": "他的吸引那个点就是妙懂的AR东西，就是看着很更直观。然后还有就说里面有很多题库。小四门哎。就是孩子很爱玩，然后我就想让我孩子多动手玩一玩。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "AR吸引",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_143",
    "brand": "妙懂",
    "text": "买了以后他就只玩那个AR，里面的东西他也不太爱看。然后就给他买了三无小星。他没那么喜欢，就因为他不喜欢玩那个，没看。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容留存",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_144",
    "brand": "妙懂",
    "text": "当时我问的那个主播，我说像三年级的小朋友怎样，他说三年级的话就拿着先玩，等后期的时候再系统地学，所以说我也没让他去看，就想让他自己吧，自己想看的话就看，不看的话以后再看。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "主播引导",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_145",
    "brand": "万物指南",
    "text": "我看见那个万物指南里面有化学，然后就买了那个。化学好像市面上好像只有它有，好像有个化学好像。物理也有。就万物他也要看。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "学科稀缺",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_146",
    "brand": "洋葱",
    "text": "我之前也买了洋葱的那个，让他学数学。然后我发现他竟然不太喜欢用那个数学，他就喜欢用那个看语文。我看到过从小学物理，但是没有进去看。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "学科偏好",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_147",
    "brand": "NB虚拟实验室",
    "text": "也是在抖音直播间看到的。他就是说启蒙，就是通识，让孩子学通识。然后我觉得还可以。因为平时光看书也看不到那么多，就想着反正就不看动画片，就看这个了。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "通识启蒙",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_148",
    "brand": "NB虚拟实验室",
    "text": "等他把里面基本上能看完了，然后可以就看那种比较应试一点的。我想的就是让他不排斥，就是他印象里面有这个东西，他就更感兴趣去学，就学的容易一些。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "减少排斥",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_149",
    "brand": "妙懂",
    "text": "我怕他现在接触那种应试一点的，就是给他感觉就是让他学，他又怕他排斥。如果是现在我就给他说的是帮你看嘛，看着玩。诶，他就没那么抵触。",
    "sentiment": "neutral",
    "dimension": "启蒙认知",
    "subDimension": "学习心态",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_150",
    "brand": "妙懂",
    "text": "妙懂偏应试一点，它里面讲的东西不是那种小孩能接受那种，别人讲的时候那种语气，其他两个讲的时候都是小朋友讲那种，他不是，他是正儿八经的讲，很正式，孩子看着好像没有那么有感觉，就是让他学习了的那种感觉。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容呈现",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_151",
    "brand": "妙懂",
    "text": "他不是不喜欢，我问他，他说他喜欢。但是比较来比较去，他就觉得他现在更喜欢看蜡笔小新和旺波，看的就像看动画片一样。相当于他喜欢，但用的不多。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "使用频次",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_152",
    "brand": "妙懂",
    "text": "妙懂偏应试，知识框架跟万物不一样。买了小四门都买了，道法也买了，但孩子也不爱看，我也没去看，就是他偏应试的感觉，不是那种启蒙类的。",
    "sentiment": "negative",
    "dimension": "启蒙认知",
    "subDimension": "应试导向",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_153",
    "brand": "万物指南",
    "text": "当时主播推荐，说是不刷题的吴姥姥，觉得比较权威。然后里面有化学，好像市面上好像只有它有化学，我家孩子也比较对化学挺感兴趣的，所以就买了。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "KOL推荐",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_154",
    "brand": "万物指南",
    "text": "如果它分开的话，估计我不会买它这个物理了。它物理化学是一起的，历史是单独的。因为主要想看化学，物理我已经有三物小星了，但没办法就只能一起买，好像是1800多。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "套餐捆绑",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_155",
    "brand": "万物指南",
    "text": "他最先看化学的时候其实挺懵的，看不懂，很多东西他都不知道那是啥。但后面看多了，他就慢慢就知道有一些原理，也知道里面这是什么名称、什么元素，还是挺感兴趣的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "学习效果",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_156",
    "brand": "万物指南",
    "text": "学化学的话给到90分吧。扣的10分就是，比如说我孩子把这个万物视频全部看完了，他能吸收多少呢？如果后面有一些系统的再系统的学习就更好了，就是提前学那种，对标初中、高中校内课表，知识体系一样的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "系统完整性",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_157",
    "brand": "万物指南",
    "text": "如果他只看了这个视频的话，他当时可能记得，后面他可能忘掉。如果他有这个实验的话，他能更清楚里面的原理，然后可能就真的会记住，记得住脑子里面就不会忘记。所以实验和启蒙是有关系的。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "实验缺失",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_158",
    "brand": "NB虚拟实验室",
    "text": "想过不知道哪个地方能够做个实验，就是物理实验、化学实验这一块，也想过但不知道哪里能做。很多东西都想了解，但目前还没找到合适的。",
    "sentiment": "neutral",
    "dimension": "启蒙认知",
    "subDimension": "实验需求",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_159",
    "brand": "万物指南",
    "text": "就是说如果他只看了这个视频的话，他当时可能记得，后面他可能忘掉，如果他有这个实验的话，就是他能更能清楚里面的原理，然后可能就会真的会记住，就记得住脑子里面他就不会忘记。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "实验缺失",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_160",
    "brand": "万物指南",
    "text": "没看出，因为我有没，没有，我不知道怎么去看这个东西。还是很重要吧，还是很期待吧。就说孩子学了多少东西，因为我平时又没看的，没去，一直关注他看的是什么。然后我想知道他到底学了什么东西？学到了什么东西？学了多少？能记住什么？主要是能记住什么？",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "学习效果",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_161",
    "brand": "万物指南",
    "text": "我关注过，但我没看到就有这些东西。就没他的，他那个APP里面就很简单。就是特别简单，画面特别简单，所以说我都不知道孩子学的到底是怎么个情况。只能看到后面的题有多少星，但是能记住多少，不清楚，学了个什么我也不太清楚。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "家长反馈",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_162",
    "brand": "万物指南",
    "text": "要看它里面有什么，如果它跟着这些这几个APP差不多那种的话，就不感兴趣。就是如果它比较全面，比如说能给家长反馈孩子学的是怎，学的怎么样啊，那种还可以。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "差异化需求",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_163",
    "brand": "万物指南",
    "text": "化学主要是用万物指南，用学科启蒙。他周一到周五基本上就是完成校内作业，然后这些看的话就是零碎的时间看，比如吃饭时间，在学习机上面看，能看两个、三个，有时候他吃饭特别慢，有可能四个、五个都有可能。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "使用场景",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_164",
    "brand": "洋葱",
    "text": "当时没有去关注物理，当时想着让他去学数学。诶，对，买了整小初的会员。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "购买动机",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_165",
    "brand": "洋葱",
    "text": "估计如果是有这种提前学的话，应该会选。因为毕竟他启蒙差不多了，看也看完了，我觉得可以的话就跟着，如果有的话就可以跟着他提前学。然后该有的题让他做之类的。洋葱的主要对我来讲主要定位还是用于提前学的，就提前学学校的那些东西。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "提前学意向",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_166",
    "brand": "洋葱",
    "text": "如果它比较全面，比如说能给家长反馈孩子学的怎么样，那种还可以。要看它里面有什么，如果它跟着这些几个APP差不多那种的话，就不感兴趣。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "启蒙产品期待",
    "sourceFileId": "default_file_5",
    "sourceFileName": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_167",
    "brand": "洋葱",
    "text": "原来在原来的那个位置就没有了，在首页里面从小学物理进去，然后它直接就显示的是一个什么早鸟价，又让我立即购买。我问孩子，他最近他就没有学，就是因为没找到位置。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "导航入口",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_168",
    "brand": "洋葱",
    "text": "这个端口是不是到时候你再放的可以明显一点？让孩子或者我们家长去看的时候，诶一下就能找到，就在哪个板块里。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "功能可见性",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_169",
    "brand": "洋葱",
    "text": "当时买洋葱学园的数学课的时候，推荐了这个物理课，我才买的。当时是郑州妈妈帮有一个线上的直播，当时主要请到了洋葱学园的老师，当时在卖数学课，科学课又间接推了一下，我就直接买了。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "购买触点",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_170",
    "brand": "洋葱",
    "text": "先看到公众号，里面内容非常契合我现在阶段的需求，然后预约了直播，直播的时候他又说了这个物理课，我就买下来，可以先让他试一下。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "决策路径",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_171",
    "brand": "洋葱",
    "text": "数学的课程里面配备的一些动画非常直观，能引导孩子，诶，我看这知识点是什么样，它是一个动画的形式展现出来的，加上跟校内是高度同步的，这几个点比较吸引我购买。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "购买动机",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_172",
    "brand": "洋葱",
    "text": "它会抛出一些问题让孩子去选，让孩子更集中注意力，如果说只是单纯的课程讲解，他真的很容易就溜号了。他只要去点去选，当时就能出题的对错，如果是错的话，会再出类似知识点，之后针对错题再做。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "互动设计",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_173",
    "brand": "洋葱",
    "text": "我更希望每天有5到10分钟或15分钟，随时想翻都能看到，更直观地去学某一些知识点。他不像那种集中两个小时高度集中的直播课，洋葱这种对我们现阶段来说更适用一些。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "学习方式",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_174",
    "brand": "洋葱",
    "text": "同步这个点挺重要的，我还是更希望他把基础学得扎实，如果跟校内同步，孩子做到哪道题不会了，去翻到校内同步的讲解，我觉得都会更方便一些。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "校内同步",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_175",
    "brand": "叫叫",
    "text": "叫叫线上统一有关于阅读的、关于写作的，同步匹配人教版语文课程的。他们就是按照大概这个时间，每周只有两节课，这两节课可能讲的都是同一个写作，对标课内的。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "课程同步",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_176",
    "brand": "叫叫",
    "text": "叫叫有阅读和小作家两个课，阅读是拓展的，带孩子去读书的；小作家是针对写作的。他们是录播课，在规定时间内看完就可以，一周两节课，不用固定在某一个时间去上。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "课程形式",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_177",
    "brand": "洋葱",
    "text": "数学的课程里面配备的一些动画很直观，能引导孩子，诶，我看这知识点是什么样？它是一个动画的形式展现出来的。然后加上就是同步，跟校内是高度同步的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "动画直观",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_178",
    "brand": "洋葱",
    "text": "它会抛出一些问题让我去选，这个也能让孩子更集中注意力一些，如果说只是单纯的课程、单纯的讲解，他真的很容易就溜号了。他只要去点去选，然后当时就能出这个题的对错，如果是错的话，他会再出一个类似于这样的知识点，之后再做习题的话，也可以针对这个错题再做。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "互动设计",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_179",
    "brand": "洋葱",
    "text": "有的时候我们会在家里提醒，诶，反正你这会闲着也没事，那你就拿着iPad看一会洋葱学园，但只提到了洋葱，没有说你看看数学或者是看看那个物理。他点开的应该是数学。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "使用频次",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_180",
    "brand": "洋葱",
    "text": "他比如说把一个单元里面比较重要的几个知识点学完的话，都会再看，我会提醒他，你比如这个知识点讲过了，你抓紧把这个学过的东西看一下。他都会再去看。数学一般一周一到两次。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "复习辅助",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_181",
    "brand": "洋葱",
    "text": "郑州把科学课纳入了主科，期中期末都在考。到初中之后它就变成了物理化学生物，我不希望他只是去死记硬背。所以想说，诶，正好有这个课可以让他去更好地理解一下，因为很多实验他其实不是日常生活里那么常见，你光给他说他不理解。刚好当时好像这个也不贵，我就顺手给他买了。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "升学驱动",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_182",
    "brand": "洋葱",
    "text": "当时我记得好像说是他们也是第一次上架卖这个课，后续比如说我买了这个课以后，有一些小的升级，或者有什么意见反馈给他们，他们后续也可以针对大家提出的建议再陆续地给他进行升级和优化。我觉得这一点也吸引了我。",
    "sentiment": "positive",
    "dimension": "购买决策",
    "subDimension": "持续迭代",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_183",
    "brand": "洋葱",
    "text": "我理解的是涵盖的知识点应该都有，只是不同步而已。结果我去找的话，一定是课内讲的是什么，我就按这个去找，划拉了一遍，发现没有，所以就也没有再看。预期有一点点落差，他好像没有像课内每个单元都能讲到。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "知识覆盖",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_184",
    "brand": "洋葱",
    "text": "5分满分，目前3分。因为我觉得这个内容确实是再多一点就更好了。基础篇里面的东西确实不算多。就是还是知识点再多一些吧，对标校内的话，其实他们校内已经讲了很多，关于土壤、人体、昆虫、天气，其实会有很多个点。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容丰富度",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_185",
    "brand": "洋葱",
    "text": "如果说是同步的话，我觉得会更好，就是使用率上会更高一些。如果说没那么同步的话，可能就是，想起来了去划了两下看一下，或者是哪个知识点真的不理解，去找一下，给他讲解一下，可能只有这两种情况才会想到去学。就没有像数学可能利用率那么高。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "同步校内",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_186",
    "brand": "洋葱",
    "text": "课程好的点就是你们做成这种动画的形式，而不是说就真的很枯燥，人手里面拿着什么玻璃瓶罐就开始给你做实验。我觉得这个还是挺好的。小学阶段，尤其是刚刚把科学纳入主科，我觉得还是让孩子更好去接触、更好去理解是最好的。",
    "sentiment": "positive",
    "dimension": "产品体验",
    "subDimension": "动画形式",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_187",
    "brand": "洋葱",
    "text": "希望他比如对这个能增加点兴趣，对课内的知识点理解得更透一些，掌握得更快一些。而不是填空题给几个空，他就从第一个空背到最后一个空，过段时间那几个空就忘得差不多了。更希望他是从实验也好，或者课程的讲解动画也好，能更好地理解和掌握，外加提升点兴趣。",
    "sentiment": "neutral",
    "dimension": "启蒙认知",
    "subDimension": "理解替代记忆",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_188",
    "brand": "洋葱",
    "text": "希望他看到这种现实中的生活现象之后，能去想一下为什么会有这个现象。比如出去遛弯，看到一些现象，他不是说看过就看过了，而会联想这是怎么导致的。就是这种，希望培养他这个学科思维。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "学科思维培养",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_189",
    "brand": "洋葱",
    "text": "希望你们能看一下我们各地区的这个课本，然后根据课本去引入一些知识点，比如说贴近小学四年级的相关物理内容，我作为家长，一去找就知道，诶，我从这个里边能找到我想要找的东西，就像数学一样，我也知道我从哪找。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "课程体系对齐",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_190",
    "brand": "洋葱",
    "text": "现阶段它是什么基础、进阶和挑战？我不知道它现在这个知识点是已经是基础还是进阶还是挑战？我只能挨个点开，然后再对应你们的那个目录往下滑，有的时候上学期就已经有电路了，我一直在基础里找，发现没有，要在进阶里找。",
    "sentiment": "negative",
    "dimension": "产品体验",
    "subDimension": "内容分级导航",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_191",
    "brand": "洋葱",
    "text": "好像是跟数学的那个洋葱做对比，因为洋葱数学是一个非常同步的状态嘛，然后大概说了一下这个数学是这样的状态，你这个物理就是以知识点的这个去呈现的，涵盖了大多数的知识点，但就是跟校内不太同步。",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "竞品对比参考",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_192",
    "brand": "洋葱",
    "text": "后续如果说有更新知识点或者课程的话，我这边也都是同步能看到的，是吗？会更新吗？因为我看了一眼生物，关于他们现在同步的东西，知识点确实也不是特别多。",
    "sentiment": "neutral",
    "dimension": "产品体验",
    "subDimension": "内容更新预期",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_193",
    "brand": "洋葱",
    "text": "后续如果说我再需要的话，是不是还得分开再买生物和地理呀？正常的话它是四科一块，那如果我已经买了物理，后面再买是怎么样的形式？能不能补差价？",
    "sentiment": "neutral",
    "dimension": "购买决策",
    "subDimension": "付费模式疑虑",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  },
  {
    "id": "default_194",
    "brand": "洋葱",
    "text": "跟数学的那个洋葱做对比，因为它很明显数学的就是一个非常同步的状态嘛，就是在详细介绍，然后下面公屏有很多大家打问题，反正大概说了一下这个数学是这样的，跟校内是非常同步的。",
    "sentiment": "positive",
    "dimension": "启蒙认知",
    "subDimension": "课内同步优势",
    "sourceFileId": "default_file_6",
    "sourceFileName": "用户访谈6·四年级·河南郑州·从小学物理"
  }
];

// ── Default project files ────────────────────────────────────────────────

export const DEFAULT_FILE_DEFS = [
  {
    "id": "default_file_1",
    "name": "用户访谈1·二年级·山东济宁·妙懂&十分通&NB实验室"
  },
  {
    "id": "default_file_2",
    "name": "用户访谈2·三年级·北京昌平·学而思&NB实验室"
  },
  {
    "id": "default_file_3",
    "name": "用户访谈3·二年级·广东中山·从小学物理"
  },
  {
    "id": "default_file_4",
    "name": "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI"
  },
  {
    "id": "default_file_5",
    "name": "用户访谈5·三年级·重庆渝中·妙懂&三五小星&NB实验室"
  },
  {
    "id": "default_file_6",
    "name": "用户访谈6·四年级·河南郑州·从小学物理"
  }
];

// ── Assemble default project ─────────────────────────────────────────────

export function buildDefaultProject(): Project {
  const files: ProjectFile[] = DEFAULT_FILE_DEFS.map((f) => ({
    ...f,
    category: 'document' as const,
    status: 'ready' as const,
    uploadedAt: 1747526400000,
    vocList: DEFAULT_VOCS.filter((v) => v.sourceFileId === f.id),
  }));
  return {
    id: 'default_project',
    name: '小学物理用研项目（示例数据）',
    createdAt: 1747526400000,
    files,
  };
}