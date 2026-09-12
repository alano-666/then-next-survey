/* Shared by the browser and server so required fields and options stay consistent. */
const SurveyQuestions = {
  demographics: [
    {id:'age', label:'你的年龄段（可跳过）', options:['18—24岁','25—34岁','35—44岁','45岁及以上','不便透露'], optional:true},
    {id:'usage', label:'你使用知乎的频率（可跳过）', options:['几乎每天','每周几次','每月几次','很少使用','从未使用'], optional:true},
    {id:'reading', label:'你阅读长文或知识内容的频率（可跳过）', options:['经常','有时','很少','几乎不读'], optional:true}
  ],
  post: [
    {id:'interest', label:'你对这篇回答有多感兴趣？', options:['完全不感兴趣','不太感兴趣','一般','比较感兴趣','非常感兴趣']},
    {id:'value', label:'这篇回答对你有多大价值？', options:['完全没有价值','不太有价值','一般','比较有价值','非常有价值']},
    {id:'curiosity', label:'你有多想知道这篇回答的后续？', options:['完全不想','不太想','一般','比较想','非常想']},
    {id:'future', label:'如果作者未来自愿公开后续，你有多愿意阅读？', options:['完全不愿意','不太愿意','不确定','比较愿意','非常愿意']},
    {id:'reason', label:'你刚才点击或未点击的主要原因是什么？', dynamic:'reason'},
    {id:'detail', label:'还有其他原因，或具体想了解的后续吗？（可跳过）', type:'text', optional:true}
  ],
  reasons: {
    clicked:['想知道故事结果','想知道计划是否实现','想知道判断是否被验证','想知道作者是否改变想法','想了解作者后来的变化','好奇按钮会做什么','误触／并不想关注','其他'],
    notClicked:['内容本身不感兴趣','文章已完整，没有后续疑问','有点好奇，但不想关注','没注意到按钮','不理解按钮含义','不想给作者压力','担心记录或隐私','其他']
  },
  final: [
    {id:'most', label:'五篇中，你最想知道哪篇的后续？', dynamic:'posts'},
    {id:'mostReason', label:'为什么？（可跳过）', type:'text', optional:true},
    {id:'least', label:'五篇中，你最不想知道哪篇的后续？', dynamic:'posts'},
    {id:'leastReason', label:'为什么？（可跳过）', type:'text', optional:true},
    {id:'features', label:'什么内容特征会让你想知道后续？（多选，可跳过）', type:'multi', optional:true, options:['重大决定','明确判断','具体计划','未来预测','重要变化','未完成的故事','内容有争议','点赞很多','作者知名','其他']},
    {id:'understanding', label:'你认为本次点击“然后呢？”意味着什么？', options:['表达后续好奇，作者自主决定是否更新','立即看到后续','作者必须回复','系统会自动写出后续','不确定']},
    {id:'overallValue', label:'一个能关注旧回答后续的功能，对你有多大价值？', options:['完全没有价值','不太有价值','一般','比较有价值','非常有价值']},
    {id:'realUse', label:'在日常阅读中，你有多愿意使用这样的功能？', options:['完全不愿意','不太愿意','不确定','比较愿意','非常愿意']},
    {id:'concern', label:'你有哪些担心或改进建议？（可跳过）', type:'text', optional:true}
  ]
};
if (typeof module !== 'undefined') module.exports = SurveyQuestions;
