/* 欧洲近代早期史 · 事件数据
 * 每条事件包含：年代、地图快照、高亮政权、地理标记、关键节点与出处。
 * 高亮优先按 SUBJECTO（宗主权）匹配，其次按 NAME 匹配；
 * 底图为 1500–1900 年间 7 个年份的示意性政权边界。
 */
window.HISTORY_EVENTS = [
  {
    id: 'italian-wars',
    year: 1494,
    end: 1559,
    kicker: '1494–1559',
    title: '意大利战争',
    snapshot: 1500,
    summary:
      '1494 年法王查理八世越过阿尔卑斯山进攻那不勒斯，开启长达六十五年的意大利战争。瓦卢瓦法国与哈布斯堡围绕米兰、那不勒斯与教宗国反复争夺；1527 年罗马之劫、1557 年圣康坦战役后，1559 年《卡托-康布雷西和约》确认西班牙在意大利的优势。',
    facts: [
      { y: '1494', t: '查理八世入侵那不勒斯，战争爆发' },
      { y: '1527', t: '帝国军队攻陷罗马，史称“罗马之劫”' },
      { y: '1559', t: '《卡托-康布雷西和约》结束战争' },
    ],
    highlights: {
      names: ['France', 'Aragón', 'Castille', 'Holy Roman Empire', 'Venice', 'Papal States', 'Swiss Confederation', 'Milan', 'Naples'],
      subjects: [],
    },
    points: [
      { lon: 9.19, lat: 45.46, label: '米兰' },
      { lon: 14.27, lat: 40.85, label: '那不勒斯' },
    ],
    note: '地图快照：1500 年。米兰、那不勒斯在该底图中并入更大的政权多边形，高亮范围包含其宗主政权。',
    sources: [
      { label: 'Britannica · Italian Wars', url: 'https://www.britannica.com/event/Italian-Wars' },
      { label: 'Wikipedia · 意大利战争', url: 'https://zh.wikipedia.org/wiki/意大利战争' },
    ],
  },
  {
    id: 'reformation',
    year: 1517,
    end: 1555,
    kicker: '1517–1555',
    title: '宗教改革',
    snapshot: 1500,
    summary:
      '1517 年马丁·路德在维滕贝格发表《九十五条论纲》，质疑赎罪券交易；印刷术使论纲在数周内传遍德意志。路德宗、加尔文宗与英国国教相继成形，1555 年《奥格斯堡和约》以“教随国定”暂时安置帝国境内的宗教分裂。',
    facts: [
      { y: '1517', t: '《九十五条论纲》张贴于维滕贝格教堂' },
      { y: '1521', t: '沃尔姆斯帝国议会，路德被宣布为异端' },
      { y: '1555', t: '《奥格斯堡和约》确立“教随国定”' },
    ],
    highlights: {
      names: ['Holy Roman Empire', 'Saxony', 'Bavaria'],
      subjects: [],
    },
    points: [{ lon: 12.65, lat: 51.87, label: '维滕贝格' }],
    note: '地图快照：1500 年，即宗教改革前夜。',
    sources: [
      { label: 'Britannica · Reformation', url: 'https://www.britannica.com/event/Reformation' },
      { label: 'Wikipedia · 宗教改革', url: 'https://zh.wikipedia.org/wiki/宗教改革' },
    ],
  },
  {
    id: 'thirty-years-war',
    year: 1618,
    end: 1648,
    kicker: '1618–1648',
    title: '三十年战争',
    snapshot: 1600,
    summary:
      '1618 年布拉格“掷出窗外事件”引爆哈布斯堡与波希米亚新教贵族的冲突，丹麦、瑞典、法国相继卷入，演变为欧洲全面战争。战火使中欧人口锐减；1648 年《威斯特伐利亚和约》确立主权国家与宗教宽容的基本框架。',
    facts: [
      { y: '1618', t: '布拉格掷出窗外事件' },
      { y: '1631', t: '马格德堡屠城，战争进入最惨烈阶段' },
      { y: '1648', t: '《威斯特伐利亚和约》签订' },
    ],
    highlights: {
      names: ['Holy Roman Empire', 'Spain', 'Habsburg Netherlands', 'Bavaria', 'Saxony', 'Sweden', 'Denmark-Norway', 'France', 'Austrian Empire'],
      subjects: [],
    },
    points: [{ lon: 14.42, lat: 50.08, label: '布拉格' }],
    note: '地图快照：1600 年，战争爆发前十八年。',
    sources: [
      { label: 'Britannica · Thirty Years’ War', url: 'https://www.britannica.com/event/Thirty-Years-War' },
      { label: 'Wikipedia · 三十年战争', url: 'https://zh.wikipedia.org/wiki/三十年战争' },
    ],
  },
  {
    id: 'westphalia',
    year: 1648,
    end: 1648,
    kicker: '1648',
    title: '威斯特伐利亚和约',
    snapshot: 1600,
    summary:
      '1648 年在明斯特与奥斯纳布吕克签订的一系列和约，同时结束三十年战争与八十年荷西战争。条约确认荷兰与瑞士独立，法国、瑞典获得领土，帝国诸侯取得对外缔约权，常被视为近代国际关系体系的原点。',
    facts: [
      { y: '1648', t: '明斯特与奥斯纳布吕克双城签约' },
      { y: '1648', t: '荷兰、瑞士被承认为独立国家' },
      { y: '1648', t: '帝国诸侯获得外交与结盟权' },
    ],
    highlights: {
      names: ['Holy Roman Empire', 'France', 'Sweden', 'Spain', 'Netherlands'],
      subjects: [],
    },
    points: [
      { lon: 7.63, lat: 51.96, label: '明斯特' },
      { lon: 8.05, lat: 52.28, label: '奥斯纳布吕克' },
    ],
    note: '地图快照：1600 年，用于对照战争前夕的帝国结构。',
    sources: [
      { label: 'Britannica · Peace of Westphalia', url: 'https://www.britannica.com/event/Peace-of-Westphalia' },
      { label: 'Wikipedia · 威斯特伐利亚和约', url: 'https://zh.wikipedia.org/wiki/威斯特伐利亚和约' },
    ],
  },
  {
    id: 'spanish-succession',
    year: 1701,
    end: 1714,
    kicker: '1701–1714',
    title: '西班牙王位继承战争',
    snapshot: 1700,
    summary:
      '1700 年西班牙哈布斯堡王朝末代君主卡洛斯二世绝嗣，遗诏传位法国路易十四之孙腓力五世。英国、荷兰与奥地利组成大同盟，阻止法西合并；1704 年布伦海姆战役扭转战局。1713 年《乌得勒支和约》与 1714 年《拉施塔特和约》确认腓力五世保留西班牙王位，但西班牙的欧洲属地被奥、英、萨伏依分割。',
    facts: [
      { y: '1700', t: '卡洛斯二世去世，腓力五世继位' },
      { y: '1704', t: '布伦海姆战役，大同盟首胜' },
      { y: '1713–14', t: '乌得勒支与拉施塔特和约' },
    ],
    highlights: {
      names: ['France', 'Austrian Empire', 'England and Ireland', 'Dutch Republic', 'Portugal', 'Savoy-Piedmont', 'Naples', 'Milan', 'Franche-Comté'],
      subjects: ['Spanish Habsburg'],
    },
    points: [
      { lon: -3.7, lat: 40.42, label: '马德里' },
      { lon: 2.17, lat: 41.38, label: '巴塞罗那' },
      { lon: 5.12, lat: 52.09, label: '乌得勒支' },
    ],
    note: '地图快照：1700 年战前边界；紫色高亮为“西班牙哈布斯堡”宗主权下的欧洲领地。',
    sources: [
      { label: 'Britannica · War of the Spanish Succession', url: 'https://www.britannica.com/event/War-of-the-Spanish-Succession' },
      { label: 'Wikipedia · 西班牙王位继承战争', url: 'https://zh.wikipedia.org/wiki/西班牙王位继承战争' },
    ],
  },
  {
    id: 'utrecht',
    year: 1713,
    end: 1714,
    kicker: '1713–1714',
    title: '乌得勒支和约',
    snapshot: 1715,
    summary:
      '1713 年英、荷、法、西等国在乌得勒支签约，1714 年奥法《拉施塔特和约》收尾。腓力五世承认西班牙王位但放弃法国王位继承权；西班牙将直布罗陀、梅诺卡、西属尼德兰、米兰、那不勒斯与撒丁割让给英国、奥地利与萨伏依。英国同时取得对西属美洲奴隶贸易的垄断权。',
    facts: [
      { y: '1713', t: '《乌得勒支和约》签订' },
      { y: '1714', t: '《拉施塔特和约》结束奥法战争' },
      { y: '1715', t: '欧洲版图进入“乌得勒支体系”' },
    ],
    highlights: {
      names: ['Spain', 'France', 'Austrian Empire', 'England and Ireland', 'Savoy-Piedmont', 'Netherlands', 'Milan', 'Naples', 'Sardinia'],
      subjects: [],
    },
    points: [{ lon: 5.12, lat: 52.09, label: '乌得勒支' }],
    note: '地图快照：1715 年，和约后的边界格局。',
    sources: [
      { label: 'Britannica · Treaties of Utrecht', url: 'https://www.britannica.com/event/Treaties-of-Utrecht' },
      { label: 'Wikipedia · 乌得勒支和约', url: 'https://zh.wikipedia.org/wiki/乌得勒支和约' },
    ],
  },
  {
    id: 'seven-years-war',
    year: 1756,
    end: 1763,
    kicker: '1756–1763',
    title: '七年战争',
    snapshot: 1715,
    summary:
      '奥地利王位继承战争后的“外交革命”重组同盟：普鲁士与英国结盟，奥地利、法国、俄国与瑞典站在对立面。欧洲战场之外，英法在北美、印度与加勒比海全面开战。1763 年《巴黎和约》与《胡贝图斯堡和约》确认普鲁士的崛起与英国的海上优势。',
    facts: [
      { y: '1756', t: '“外交革命”，同盟体系翻转' },
      { y: '1759', t: '魁北克战役，英国夺取加拿大' },
      { y: '1763', t: '《巴黎和约》《胡贝图斯堡和约》' },
    ],
    highlights: {
      names: ['Prussia', 'Austrian Empire', 'France', 'England and Ireland', 'Tsardom of Muscovy', 'Sweden', 'Saxony', 'Bavaria'],
      subjects: [],
    },
    points: [
      { lon: 13.4, lat: 52.52, label: '柏林' },
      { lon: 16.37, lat: 48.21, label: '维也纳' },
    ],
    note: '地图快照：1715 年，为战前约四十年的边界示意，仅用于空间定位。',
    sources: [
      { label: 'Britannica · Seven Years’ War', url: 'https://www.britannica.com/event/Seven-Years-War' },
      { label: 'Wikipedia · 七年战争', url: 'https://zh.wikipedia.org/wiki/七年战争' },
    ],
  },
  {
    id: 'french-revolution',
    year: 1789,
    end: 1799,
    kicker: '1789–1799',
    title: '法国大革命',
    snapshot: 1783,
    summary:
      '1789 年三级会议召开、巴黎民众攻占巴士底狱，《人权与公民权宣言》颁布。1792 年法兰西第一共和国成立，1793 年路易十六被处决，恐怖统治与对外战争接踵而至。1799 年拿破仑·波拿巴发动雾月政变，革命进入新的阶段。',
    facts: [
      { y: '1789', t: '攻占巴士底狱，《人权宣言》' },
      { y: '1792', t: '法兰西第一共和国成立' },
      { y: '1793', t: '路易十六被处决，恐怖统治开始' },
    ],
    highlights: {
      names: ['France', 'Austrian Empire', 'Prussia', 'Spain', 'United Kingdom of Great Britain and Ireland'],
      subjects: [],
    },
    points: [{ lon: 2.35, lat: 48.86, label: '巴黎' }],
    note: '地图快照：1783 年，革命前六年的欧洲边界。',
    sources: [
      { label: 'Britannica · French Revolution', url: 'https://www.britannica.com/event/French-Revolution' },
      { label: 'Wikipedia · 法国大革命', url: 'https://zh.wikipedia.org/wiki/法国大革命' },
    ],
  },
  {
    id: 'napoleonic-wars',
    year: 1803,
    end: 1815,
    kicker: '1803–1815',
    title: '拿破仑战争',
    snapshot: 1815,
    summary:
      '拿破仑·波拿巴 1804 年称帝，奥斯特里茨（1805）与耶拿（1806）之后掌控西欧，并以“大陆体系”封锁英国。1812 年远征俄国惨败，1813 年莱比锡会战、1814 年巴黎陷落、1815 年滑铁卢终结帝国。战后维也纳会议重划欧洲版图。',
    facts: [
      { y: '1805', t: '奥斯特里茨战役' },
      { y: '1812', t: '远征俄国，大军团崩溃' },
      { y: '1815', t: '滑铁卢战役，帝国终结' },
    ],
    highlights: {
      names: ['France', 'Austrian Empire', 'Prussia', 'Russian Empire', 'United Kingdom of Great Britain and Ireland', 'Spain', 'Bavaria', 'Saxony', 'Netherlands'],
      subjects: [],
    },
    points: [
      { lon: 16.37, lat: 48.21, label: '维也纳' },
      { lon: 4.36, lat: 50.82, label: '滑铁卢' },
    ],
    note: '地图快照：1815 年，为战争结束后的边界，不等同于拿破仑鼎盛时期的版图。',
    sources: [
      { label: 'Britannica · Napoleonic Wars', url: 'https://www.britannica.com/event/Napoleonic-Wars' },
      { label: 'Wikipedia · 拿破仑战争', url: 'https://zh.wikipedia.org/wiki/拿破仑战争' },
    ],
  },
  {
    id: 'vienna',
    year: 1814,
    end: 1815,
    kicker: '1814–1815',
    title: '维也纳会议',
    snapshot: 1815,
    summary:
      '战胜国在维也纳重划欧洲：法国恢复 1792 年边界，奥属尼德兰并入荷兰，德意志成立邦联，意大利仍保持分裂，波兰-萨克森问题以妥协收场。正统主义与补偿原则主导，俄、奥、普、英构成均势，欧洲进入“维也纳体系”。',
    facts: [
      { y: '1814', t: '维也纳会议开幕' },
      { y: '1815', t: '《最后议定书》签署' },
      { y: '1815', t: '德意志邦联成立，意大利维持分裂' },
    ],
    highlights: {
      names: ['France', 'Austrian Empire', 'Prussia', 'Russian Empire', 'United Kingdom of Great Britain and Ireland', 'Netherlands', 'Bavaria', 'Saxony', 'Kingdom of Sardinia'],
      subjects: [],
    },
    points: [{ lon: 16.37, lat: 48.21, label: '维也纳' }],
    note: '地图快照：1815 年，即会议后的正式边界。',
    sources: [
      { label: 'Britannica · Congress of Vienna', url: 'https://www.britannica.com/event/Congress-of-Vienna' },
      { label: 'Wikipedia · 维也纳会议', url: 'https://zh.wikipedia.org/wiki/维也纳会议' },
    ],
  },
  {
    id: 'revolutions-1848',
    year: 1848,
    end: 1849,
    kicker: '1848–1849',
    title: '1848 革命之年',
    snapshot: 1815,
    summary:
      '巴黎二月革命推翻七月王朝，火花迅速蔓延至维也纳、柏林、布达佩斯、米兰与威尼斯。法兰克福国民议会尝试建立统一的德意志民族国家，但各邦君主很快重整军队。革命多被镇压，却加速了封建义务的废除与民族主义政治动员。',
    facts: [
      { y: '1848', t: '巴黎二月革命，革命浪潮席卷欧洲' },
      { y: '1848', t: '法兰克福国民议会召开' },
      { y: '1849', t: '各地革命相继被镇压' },
    ],
    highlights: {
      names: ['France', 'Austrian Empire', 'Prussia', 'Kingdom of Sardinia', 'Bavaria', 'Lombardy', 'Venetia'],
      subjects: [],
    },
    points: [
      { lon: 2.35, lat: 48.86, label: '巴黎' },
      { lon: 16.37, lat: 48.21, label: '维也纳' },
      { lon: 13.4, lat: 52.52, label: '柏林' },
      { lon: 19.04, lat: 47.5, label: '布达佩斯' },
      { lon: 9.19, lat: 45.46, label: '米兰' },
    ],
    note: '地图快照：1815 年，用于呈现革命前夜的维也纳体系。',
    sources: [
      { label: 'Britannica · Revolutions of 1848', url: 'https://www.britannica.com/event/Revolutions-of-1848' },
      { label: 'Wikipedia · 1848年革命', url: 'https://zh.wikipedia.org/wiki/1848年革命' },
    ],
  },
  {
    id: 'unification',
    year: 1861,
    end: 1871,
    kicker: '1861–1871',
    title: '意大利与德意志统一',
    snapshot: 1900,
    summary:
      '撒丁王国在加富尔与加里波第推动下，借 1859 年对奥战争与 1860 年远征两西西里，于 1861 年建立意大利王国，1870 年收复罗马。普鲁士在俾斯麦主导下历经 1864、1866、1870 三场战争，1871 年在凡尔赛宫镜厅宣告德意志帝国成立，欧洲均势彻底改写。',
    facts: [
      { y: '1861', t: '意大利王国宣告成立' },
      { y: '1870', t: '罗马并入意大利王国' },
      { y: '1871', t: '德意志帝国在凡尔赛宫成立' },
    ],
    highlights: {
      names: ['Italy', 'Germany', 'France', 'Austria Hungary', 'Prussia'],
      subjects: [],
    },
    points: [
      { lon: 7.68, lat: 45.07, label: '都灵' },
      { lon: 13.4, lat: 52.52, label: '柏林' },
    ],
    note: '地图快照：1900 年，统一完成后的民族国家格局。',
    sources: [
      { label: 'Britannica · Unification of Italy', url: 'https://www.britannica.com/event/unification-of-Italy' },
      { label: 'Britannica · German Empire', url: 'https://www.britannica.com/event/German-Empire' },
    ],
  },
];
