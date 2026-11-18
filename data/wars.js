/* 欧洲战争线：各国之间的战争 1494–1878
 * 交战双方以“阵营”呈现；polities 的 name 对应历史底图中的政权名。
 * 史料：吴于廑、齐世荣主编《世界史·近代史编》上/下卷（第2版）。
 */
window.HISTORY_WARS = [
  {
    id: 'italian-wars',
    name: '意大利战争',
    start: 1494,
    end: 1559,
    snapshot: 1500,
    sides: {
      a: { label: '法国—奥斯曼', polities: [{ name: 'France', label: '法国' }, { name: 'Ottoman Empire', label: '奥斯曼帝国' }] },
      b: { label: '哈布斯堡—西班牙—教宗', polities: [{ name: 'Castille', label: '卡斯蒂利亚' }, { name: 'Aragón', label: '阿拉贡' }, { name: 'Holy Roman Empire', label: '神圣罗马帝国' }, { name: 'Papal States', label: '教宗国' }, { name: 'Venice', label: '威尼斯' }] },
    },
    summary:
      '1494 年法王查理八世入侵那不勒斯，法国与哈布斯堡—西班牙围绕米兰、那不勒斯反复争夺。1525 年帕维亚战役、1527 年罗马之劫、1557 年圣康坦战役后，1559 年《卡托-康布雷西和约》确认西班牙在意大利的优势。',
    battles: [
      { year: 1494, name: '那不勒斯', lon: 14.27, lat: 40.85 },
      { year: 1525, name: '帕维亚', lon: 9.16, lat: 45.19 },
      { year: 1527, name: '罗马之劫', lon: 12.5, lat: 41.9 },
      { year: 1557, name: '圣康坦', lon: 3.43, lat: 49.85 },
    ],
    outcome: '西班牙取得米兰、那不勒斯等地的支配权，法国退出意大利争夺。',
    note: '地图快照 1500 年；文艺复兴时期的意大利尚未统一。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第一章' },
      { label: 'Wikipedia · 意大利战争', url: 'https://zh.wikipedia.org/wiki/意大利战争' },
    ],
  },
  {
    id: 'dutch-revolt-war',
    name: '八十年战争',
    start: 1568,
    end: 1648,
    snapshot: 1600,
    sides: {
      a: { label: '尼德兰联省—英国', polities: [{ name: 'Dutch Republic', label: '荷兰共和国' }, { name: 'England and Ireland', label: '英格兰' }] },
      b: { label: '西班牙哈布斯堡', polities: [{ name: 'Spain', label: '西班牙' }, { name: 'Habsburg Netherlands', label: '哈布斯堡尼德兰' }] },
    },
    summary:
      '尼德兰北方诸省反抗西班牙的征税与宗教压迫，1566 年圣像破坏运动后转入武装斗争。1581 年联省宣布脱离西班牙，1609 年签订十二年休战；1648 年《威斯特伐利亚和约》正式承认荷兰独立。',
    battles: [
      { year: 1568, name: '海尔利赫姆', lon: 4.75, lat: 51.83 },
      { year: 1600, name: '纽波特', lon: 2.75, lat: 51.13 },
      { year: 1648, name: '明斯特', lon: 7.63, lat: 51.96 },
    ],
    outcome: '荷兰共和国独立，成为17世纪重要的商业与海上强国。',
    note: '地图快照 1600 年；尼德兰南北分裂已经成形。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第一章第四节“尼德兰革命”' },
      { label: 'Wikipedia · 八十年战争', url: 'https://zh.wikipedia.org/wiki/八十年戰爭' },
    ],
  },
  {
    id: 'thirty-years-war',
    name: '三十年战争',
    start: 1618,
    end: 1648,
    snapshot: 1600,
    sides: {
      a: { label: '反哈布斯堡同盟', polities: [{ name: 'France', label: '法国' }, { name: 'Sweden', label: '瑞典' }, { name: 'Denmark-Norway', label: '丹麦-挪威' }, { name: 'Dutch Republic', label: '荷兰共和国' }, { name: 'Saxony', label: '萨克森' }] },
      b: { label: '哈布斯堡阵营', polities: [{ name: 'Holy Roman Empire', label: '神圣罗马帝国' }, { name: 'Spain', label: '西班牙' }, { name: 'Habsburg Netherlands', label: '哈布斯堡尼德兰' }, { name: 'Bavaria', label: '巴伐利亚' }] },
    },
    phases: [
      {
        from: 1618, to: 1629, label: '波希米亚—丹麦阶段',
        note: '波希米亚新教贵族起义，丹麦随后介入；哈布斯堡与西班牙、巴伐利亚镇压。',
        a: { label: '波希米亚—丹麦—新教诸侯', polities: [{ name: 'Denmark-Norway', label: '丹麦-挪威' }, { name: 'Saxony', label: '萨克森' }, { name: 'Dutch Republic', label: '荷兰共和国' }] },
        b: { label: '哈布斯堡—西班牙—巴伐利亚', polities: [{ name: 'Holy Roman Empire', label: '神圣罗马帝国' }, { name: 'Spain', label: '西班牙' }, { name: 'Bavaria', label: '巴伐利亚' }] },
      },
      {
        from: 1630, to: 1634, label: '瑞典阶段',
        note: '古斯塔夫二世登陆波美拉尼亚，瑞典成为新教阵营核心；1634 年内德林根战败。',
        a: { label: '瑞典—萨克森—荷兰', polities: [{ name: 'Sweden', label: '瑞典' }, { name: 'Saxony', label: '萨克森' }, { name: 'Dutch Republic', label: '荷兰共和国' }] },
        b: { label: '哈布斯堡—西班牙—巴伐利亚', polities: [{ name: 'Holy Roman Empire', label: '神圣罗马帝国' }, { name: 'Spain', label: '西班牙' }, { name: 'Bavaria', label: '巴伐利亚' }] },
      },
      {
        from: 1635, to: 1648, label: '法国参战阶段', snapshot: 1650,
        note: '法国直接对西班牙宣战，战争从宗教冲突转为哈布斯堡与波旁的地缘决战。',
        a: { label: '法国—瑞典—荷兰—萨克森', polities: [{ name: 'France', label: '法国' }, { name: 'Sweden', label: '瑞典' }, { name: 'Dutch Republic', label: '荷兰共和国' }, { name: 'Saxony', label: '萨克森' }] },
        b: { label: '哈布斯堡—西班牙—巴伐利亚', polities: [{ name: 'Holy Roman Empire', label: '神圣罗马帝国' }, { name: 'Spain', label: '西班牙' }, { name: 'Habsburg Netherlands', label: '哈布斯堡尼德兰' }, { name: 'Bavaria', label: '巴伐利亚' }] },
      },
    ],
    summary:
      '1618 年布拉格“掷出窗外事件”引爆哈布斯堡与波希米亚新教贵族的冲突，丹麦、瑞典、法国相继卷入。战争使中欧人口锐减；1648 年《威斯特伐利亚和约》确立主权国家与宗教宽容框架，神圣罗马帝国进一步虚化。',
    battles: [
      { year: 1618, name: '布拉格', lon: 14.42, lat: 50.08 },
      { year: 1631, name: '马格德堡', lon: 11.63, lat: 52.13 },
      { year: 1634, name: '内德林根', lon: 10.49, lat: 48.85 },
      { year: 1648, name: '明斯特', lon: 7.63, lat: 51.96 },
    ],
    outcome: '法国、瑞典崛起，帝国诸侯主权扩大，西班牙继续衰落。',
    note: '地图快照 1600 年，为战争爆发前十八年的格局。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第二章' },
      { label: 'Wikipedia · 三十年战争', url: 'https://zh.wikipedia.org/wiki/三十年战争' },
    ],
  },
  {
    id: 'great-northern-war',
    name: '北方战争',
    start: 1700,
    end: 1721,
    snapshot: 1700,
    sides: {
      a: { label: '俄国—丹麦—波兰—萨克森', polities: [{ name: 'Tsardom of Muscovy', label: '俄国' }, { name: 'Denmark-Norway', label: '丹麦-挪威' }, { name: 'Polish–Lithuanian Commonwealth', label: '波兰-立陶宛' }, { name: 'Saxony', label: '萨克森' }] },
      b: { label: '瑞典—奥斯曼', polities: [{ name: 'Sweden', label: '瑞典' }, { name: 'Ottoman Empire', label: '奥斯曼帝国' }] },
    },
    summary:
      '1700 年彼得一世为夺取波罗的海出海口对瑞典开战。1709 年波尔塔瓦战役成为转折，瑞典陆军崩溃；1721 年《尼斯塔德和约》使俄国获得波罗的海东岸，瑞典由北欧强国降为二流国家。',
    battles: [
      { year: 1700, name: '纳尔瓦', lon: 28.19, lat: 59.38 },
      { year: 1709, name: '波尔塔瓦', lon: 34.55, lat: 49.59 },
      { year: 1721, name: '尼斯塔德', lon: 21.51, lat: 60.91 },
    ],
    outcome: '俄国取得波罗的海出海口，正式跻身欧洲强国。',
    note: '地图快照 1700 年，战争爆发时的北欧与东欧。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第二章第二节“欧洲大陆的封建专制制度”' },
      { label: 'Wikipedia · 大北方战争', url: 'https://zh.wikipedia.org/wiki/大北方戰爭' },
    ],
  },
  {
    id: 'spanish-succession-war',
    name: '西班牙王位继承战争',
    start: 1701,
    end: 1714,
    snapshot: 1700,
    sides: {
      a: { label: '法国—西班牙—巴伐利亚', polities: [{ name: 'France', label: '法国' }, { name: 'Spain', label: '西班牙' }, { name: 'Bavaria', label: '巴伐利亚' }] },
      b: { label: '反法大同盟', polities: [{ name: 'England and Ireland', label: '英国' }, { name: 'Dutch Republic', label: '荷兰共和国' }, { name: 'Austrian Empire', label: '奥地利' }, { name: 'Portugal', label: '葡萄牙' }, { name: 'Savoy-Piedmont', label: '萨伏依-撒丁' }] },
    },
    summary:
      '1700 年西班牙哈布斯堡末代君主卡洛斯二世绝嗣，遗诏传位路易十四之孙腓力五世。英、荷、奥组成大同盟阻止法西合并；1704 年布伦海姆、1709 年马尔普拉凯后，1713/14 年乌得勒支与拉施塔特和约确认波旁保留西班牙王位，但分割其欧洲属地。',
    battles: [
      { year: 1704, name: '布伦海姆', lon: 10.57, lat: 48.61 },
      { year: 1706, name: '拉米伊', lon: 4.9, lat: 50.63 },
      { year: 1709, name: '马尔普拉凯', lon: 3.94, lat: 50.42 },
      { year: 1713, name: '乌得勒支', lon: 5.12, lat: 52.09 },
    ],
    outcome: '腓力五世保留西班牙王位但放弃法国继承权；西属尼德兰、米兰、那不勒斯归奥地利，直布罗陀归英国。',
    note: '地图快照 1700 年战前边界；“西班牙”在底图中标为西班牙哈布斯堡宗主权。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第二章第二节' },
      { label: 'Wikipedia · 西班牙王位继承战争', url: 'https://zh.wikipedia.org/wiki/西班牙王位繼承戰爭' },
    ],
  },
  {
    id: 'austrian-succession-war',
    name: '奥地利王位继承战争',
    start: 1740,
    end: 1748,
    snapshot: 1715,
    sides: {
      a: { label: '普鲁士—法国—巴伐利亚—西班牙', polities: [{ name: 'Prussia', label: '普鲁士' }, { name: 'France', label: '法国' }, { name: 'Bavaria', label: '巴伐利亚' }, { name: 'Spain', label: '西班牙' }] },
      b: { label: '奥地利—英国—荷兰—汉诺威', polities: [{ name: 'Austrian Empire', label: '奥地利' }, { name: 'United Kingdom', label: '英国' }, { name: 'Dutch Republic', label: '荷兰共和国' }, { name: 'Hanover', label: '汉诺威' }] },
    },
    summary:
      '1740 年腓特烈二世以玛丽亚·特利萨继位为由入侵西里西亚，普鲁士、法国、巴伐利亚、西班牙与奥地利、英国等展开混战。1748 年《亚琛和约》确认普鲁士保有西里西亚，奥地利被迫启动财政与军事改革。',
    battles: [
      { year: 1741, name: '莫尔维茨', lon: 17.3, lat: 50.85 },
      { year: 1745, name: '霍亨弗里德贝格', lon: 16.1, lat: 50.95 },
      { year: 1748, name: '亚琛', lon: 6.08, lat: 50.78 },
    ],
    outcome: '普鲁士获得西里西亚，正式跻身德意志二元强权；奥地利进入改革时代。',
    note: '地图快照 1715 年，战争爆发前的欧洲格局。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第二章第二节' },
      { label: 'Wikipedia · 奥地利王位继承战争', url: 'https://zh.wikipedia.org/wiki/奧地利王位繼承戰爭' },
    ],
  },
  {
    id: 'seven-years-war',
    name: '七年战争',
    start: 1756,
    end: 1763,
    snapshot: 1715,
    sides: {
      a: { label: '普鲁士—英国—汉诺威', polities: [{ name: 'Prussia', label: '普鲁士' }, { name: 'United Kingdom', label: '英国' }, { name: 'Hanover', label: '汉诺威' }] },
      b: { label: '奥地利—法国—俄国—瑞典—萨克森', polities: [{ name: 'Austrian Empire', label: '奥地利' }, { name: 'France', label: '法国' }, { name: 'Tsardom of Muscovy', label: '俄国' }, { name: 'Sweden', label: '瑞典' }, { name: 'Saxony', label: '萨克森' }] },
    },
    phases: [
      {
        from: 1756, to: 1761, label: '英普同盟 vs 奥法俄',
        note: '“外交革命”后的主战场：普鲁士在萨克森、西里西亚与波希米亚对抗奥法俄；英国在海上与北美牵制法国。',
        a: { label: '普鲁士—英国—汉诺威', polities: [{ name: 'Prussia', label: '普鲁士' }, { name: 'United Kingdom', label: '英国' }, { name: 'Hanover', label: '汉诺威' }] },
        b: { label: '奥地利—法国—俄国—瑞典—萨克森', polities: [{ name: 'Austrian Empire', label: '奥地利' }, { name: 'France', label: '法国' }, { name: 'Tsardom of Muscovy', label: '俄国' }, { name: 'Sweden', label: '瑞典' }, { name: 'Saxony', label: '萨克森' }] },
      },
      {
        from: 1762, to: 1763, label: '西班牙参战阶段',
        note: '1762 年西班牙依据“家族条约”加入法国一方，葡萄牙则站在英国一方；但战局已由英国海上优势决定。',
        a: { label: '普鲁士—英国—汉诺威—葡萄牙', polities: [{ name: 'Prussia', label: '普鲁士' }, { name: 'United Kingdom', label: '英国' }, { name: 'Hanover', label: '汉诺威' }, { name: 'Portugal', label: '葡萄牙' }] },
        b: { label: '奥地利—法国—俄国—瑞典—萨克森—西班牙', polities: [{ name: 'Austrian Empire', label: '奥地利' }, { name: 'France', label: '法国' }, { name: 'Tsardom of Muscovy', label: '俄国' }, { name: 'Sweden', label: '瑞典' }, { name: 'Saxony', label: '萨克森' }, { name: 'Spain', label: '西班牙' }] },
      },
    ],
    summary:
      '“外交革命”重组欧洲同盟：普鲁士与英国结盟，对抗奥地利、法国、俄国、瑞典与萨克森。1757 年罗斯巴赫与洛伊滕战役使普鲁士绝处逢生，1763 年《巴黎和约》与《胡贝图斯堡和约》确认英国海外霸权与普鲁士的崛起。',
    battles: [
      { year: 1757, name: '罗斯巴赫', lon: 11.65, lat: 51.27 },
      { year: 1757, name: '洛伊滕', lon: 16.85, lat: 51.15 },
      { year: 1759, name: '明登', lon: 8.91, lat: 52.29 },
      { year: 1763, name: '巴黎', lon: 2.35, lat: 48.86 },
    ],
    outcome: '英国夺取加拿大与印度优势；普鲁士保住西里西亚，成为欧洲强国。',
    note: '地图快照 1715 年，为战争前约四十年的边界示意。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第二章第二节' },
      { label: 'Wikipedia · 七年战争', url: 'https://zh.wikipedia.org/wiki/七年战争' },
    ],
  },
  {
    id: 'french-revolutionary-war',
    name: '法国革命战争',
    start: 1792,
    end: 1802,
    snapshot: 1783,
    sides: {
      a: { label: '革命法国', polities: [{ name: 'France', label: '法国' }] },
      b: { label: '第一次反法同盟', polities: [{ name: 'Austrian Empire', label: '奥地利' }, { name: 'Prussia', label: '普鲁士' }, { name: 'United Kingdom', label: '英国' }, { name: 'Spain', label: '西班牙' }, { name: 'Netherlands', label: '荷兰' }] },
    },
    summary:
      '1792 年法国对奥宣战，瓦尔米战役阻止普奥联军进入巴黎；1794 年弗勒吕斯战役后法军占领低地国家，1796–97 年拿破仑在意大利连战连胜。1802 年《亚眠和约》暂时结束第一次与第二次反法同盟的战争。',
    battles: [
      { year: 1792, name: '瓦尔米', lon: 4.7, lat: 49.08 },
      { year: 1794, name: '弗勒吕斯', lon: 4.55, lat: 50.48 },
      { year: 1796, name: '洛迪', lon: 9.5, lat: 45.31 },
      { year: 1802, name: '亚眠', lon: 2.3, lat: 49.89 },
    ],
    outcome: '法国保住革命政权并扩张到莱茵河与意大利，反法同盟第一次瓦解。',
    note: '地图快照 1783 年，革命前夜的欧洲边界。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第三章第二节“法国大革命”' },
      { label: 'Wikipedia · 法国大革命战争', url: 'https://zh.wikipedia.org/wiki/法国大革命战争' },
    ],
  },
  {
    id: 'napoleonic-wars',
    name: '拿破仑战争',
    start: 1803,
    end: 1815,
    snapshot: 1800,
    sides: {
      a: { label: '法兰西帝国及附庸', polities: [{ name: 'France', label: '法国' }, { name: 'Bavaria', label: '巴伐利亚' }, { name: 'Saxony', label: '萨克森' }] },
      b: { label: '反法同盟', polities: [{ name: 'United Kingdom of Great Britain and Ireland', label: '英国' }, { name: 'Russian Empire', label: '俄国' }, { name: 'Austrian Empire', label: '奥地利' }, { name: 'Prussia', label: '普鲁士' }, { name: 'Spain', label: '西班牙' }, { name: 'Portugal', label: '葡萄牙' }, { name: 'Sweden–Norway', label: '瑞典-挪威' }] },
    },
    phases: [
      {
        from: 1803, to: 1807, label: '第三、第四次反法同盟',
        note: '1805 年奥斯特里茨、1806 年耶拿—奥尔施泰特、1807 年弗里德兰，法国击败奥、普、俄，建立大陆体系。',
        a: { label: '法国—巴伐利亚—萨克森', polities: [{ name: 'France', label: '法国' }, { name: 'Bavaria', label: '巴伐利亚' }, { name: 'Saxony', label: '萨克森' }] },
        b: { label: '英国—奥地利—俄国—普鲁士—瑞典', polities: [{ name: 'United Kingdom of Great Britain and Ireland', label: '英国' }, { name: 'Austrian Empire', label: '奥地利' }, { name: 'Russian Empire', label: '俄国' }, { name: 'Prussia', label: '普鲁士' }, { name: 'Sweden–Norway', label: '瑞典' }] },
      },
      {
        from: 1809, to: 1809, label: '第五次反法同盟',
        note: '奥地利单独对法开战，瓦格拉姆战役后再度战败；普鲁士、俄国暂未参战。',
        a: { label: '法国—巴伐利亚—萨克森', polities: [{ name: 'France', label: '法国' }, { name: 'Bavaria', label: '巴伐利亚' }, { name: 'Saxony', label: '萨克森' }] },
        b: { label: '英国—奥地利', polities: [{ name: 'United Kingdom of Great Britain and Ireland', label: '英国' }, { name: 'Austrian Empire', label: '奥地利' }] },
      },
      {
        from: 1812, to: 1814, label: '第六次反法同盟', snapshot: 1815,
        note: '远征俄国失败后，俄、普、奥、英、瑞典与西班牙、葡萄牙联合；1813 年莱比锡、1814 年巴黎陷落。',
        a: { label: '法国—巴伐利亚—萨克森', polities: [{ name: 'France', label: '法国' }, { name: 'Bavaria', label: '巴伐利亚' }, { name: 'Saxony', label: '萨克森' }] },
        b: { label: '英—俄—普—奥—瑞典—西—葡', polities: [{ name: 'United Kingdom of Great Britain and Ireland', label: '英国' }, { name: 'Russian Empire', label: '俄国' }, { name: 'Prussia', label: '普鲁士' }, { name: 'Austrian Empire', label: '奥地利' }, { name: 'Sweden–Norway', label: '瑞典' }, { name: 'Spain', label: '西班牙' }, { name: 'Portugal', label: '葡萄牙' }] },
      },
      {
        from: 1815, to: 1815, label: '百日与第七次反法同盟', snapshot: 1815,
        note: '拿破仑重返巴黎，英、俄、普、奥、荷联合；滑铁卢战役终结帝国。',
        a: { label: '法国', polities: [{ name: 'France', label: '法国' }] },
        b: { label: '英—俄—普—奥—荷兰', polities: [{ name: 'United Kingdom of Great Britain and Ireland', label: '英国' }, { name: 'Russian Empire', label: '俄国' }, { name: 'Prussia', label: '普鲁士' }, { name: 'Austrian Empire', label: '奥地利' }, { name: 'Netherlands', label: '荷兰' }] },
      },
    ],
    summary:
      '1805 年奥斯特里茨与特拉法加分别奠定陆海格局；1806 年大陆体系封锁英国。1812 年远征俄国失败，1813 年莱比锡会战、1814 年巴黎陷落、1815 年滑铁卢终结帝国，维也纳会议重划欧洲。',
    battles: [
      { year: 1805, name: '奥斯特里茨', lon: 16.76, lat: 49.13 },
      { year: 1807, name: '弗里德兰', lon: 21.01, lat: 54.36 },
      { year: 1809, name: '瓦格拉姆', lon: 16.5, lat: 48.3 },
      { year: 1812, name: '博罗季诺', lon: 35.78, lat: 55.52 },
      { year: 1813, name: '莱比锡', lon: 12.37, lat: 51.34 },
      { year: 1815, name: '滑铁卢', lon: 4.36, lat: 50.82 },
    ],
    outcome: '法兰西帝国崩溃，维也纳体系确立；民族主义与自由主义在全欧扩散。',
    note: '地图快照 1800 年，为拿破仑战争爆发前的边界。',
    sources: [
      { label: '《世界史·近代史编》上卷（第2版），第三章' },
      { label: 'Wikipedia · 拿破仑战争', url: 'https://zh.wikipedia.org/wiki/拿破仑战争' },
    ],
  },
  {
    id: 'crimean-war',
    name: '克里米亚战争',
    start: 1853,
    end: 1856,
    snapshot: 1815,
    sides: {
      a: { label: '俄国', polities: [{ name: 'Russian Empire', label: '俄国' }] },
      b: { label: '奥斯曼—英—法—撒丁', polities: [{ name: 'Ottoman Empire', label: '奥斯曼帝国' }, { name: 'United Kingdom of Great Britain and Ireland', label: '英国' }, { name: 'France', label: '法国' }, { name: 'Kingdom of Sardinia', label: '撒丁王国' }] },
    },
    summary:
      '1853 年俄国以“圣地”管辖权争端为由入侵奥斯曼帝国，英法于 1854 年参战，战争集中在克里米亚半岛。1855 年塞瓦斯托波尔陷落，1856 年《巴黎和约》规定黑海中立，俄国在黑海的优势被暂时遏制。',
    battles: [
      { year: 1853, name: '锡诺普', lon: 35.15, lat: 42.02 },
      { year: 1854, name: '阿尔马', lon: 33.99, lat: 44.83 },
      { year: 1855, name: '塞瓦斯托波尔', lon: 33.52, lat: 44.6 },
      { year: 1856, name: '巴黎', lon: 2.35, lat: 48.86 },
    ],
    outcome: '俄国战败，黑海中立化；奥斯曼帝国暂时保全，英法在东地中海优势增强。',
    note: '地图快照 1815 年，为战争前约四十年的边界示意。',
    sources: [
      { label: '《世界史·近代史编》下卷（第2版），第五章' },
      { label: 'Wikipedia · 克里米亚战争', url: 'https://zh.wikipedia.org/wiki/克里米亚战争' },
    ],
  },
  {
    id: 'second-schleswig-war',
    name: '普丹战争',
    start: 1864,
    end: 1864,
    snapshot: 1815,
    sides: {
      a: { label: '普鲁士—奥地利', polities: [{ name: 'Prussia', label: '普鲁士' }, { name: 'Austrian Empire', label: '奥地利' }] },
      b: { label: '丹麦', polities: [{ name: 'Denmark', label: '丹麦' }] },
    },
    summary:
      '1864 年普鲁士与奥地利以石勒苏益格-荷尔斯泰因问题对丹麦开战，普军在迪伯尔筑垒取胜，丹麦被迫签订《维也纳和约》，放弃两公国。战后普奥分管两地，埋下 1866 年冲突的伏笔。',
    battles: [
      { year: 1864, name: '迪伯尔', lon: 9.73, lat: 54.94 },
      { year: 1864, name: '维也纳', lon: 16.37, lat: 48.21 },
    ],
    outcome: '丹麦战败，石勒苏益格与荷尔斯泰因归普奥共管。',
    note: '地图快照 1815 年，仅用于定位丹麦与北德意志。',
    sources: [
      { label: '《世界史·近代史编》下卷（第2版），第五章第一节“俾斯麦与德国的统一”' },
      { label: 'Wikipedia · 普丹战争', url: 'https://zh.wikipedia.org/wiki/普丹战争' },
    ],
  },
  {
    id: 'austro-prussian-war',
    name: '普奥战争',
    start: 1866,
    end: 1866,
    snapshot: 1815,
    sides: {
      a: { label: '普鲁士—意大利', polities: [{ name: 'Prussia', label: '普鲁士' }, { name: 'Kingdom of Sardinia', label: '意大利（撒丁）' }] },
      b: { label: '奥地利—德意志邦联', polities: [{ name: 'Austrian Empire', label: '奥地利' }, { name: 'Bavaria', label: '巴伐利亚' }, { name: 'Saxony', label: '萨克森' }, { name: 'Hanover', label: '汉诺威' }] },
    },
    summary:
      '1866 年普鲁士以石勒苏益格-荷尔斯泰因争端对奥地利开战，克尼格雷茨战役决定胜负。普鲁士解散德意志邦联、吞并北德意志诸邦，奥地利退出德意志事务，为 1871 年统一铺路。',
    battles: [
      { year: 1866, name: '克尼格雷茨', lon: 15.74, lat: 50.21 },
      { year: 1866, name: '布拉格', lon: 14.42, lat: 50.08 },
    ],
    outcome: '普鲁士主导北德意志，奥地利被排除出德意志；意大利获得威尼西亚。',
    note: '地图快照 1815 年，为战争前半个世纪的边界示意。',
    sources: [
      { label: '《世界史·近代史编》下卷（第2版），第五章第一节“俾斯麦与德国的统一”' },
      { label: 'Wikipedia · 普奥战争', url: 'https://zh.wikipedia.org/wiki/普奥战争' },
    ],
  },
  {
    id: 'franco-prussian-war',
    name: '普法战争',
    start: 1870,
    end: 1871,
    snapshot: 1880,
    sides: {
      a: { label: '普鲁士—德意志诸邦', polities: [{ name: 'Germany', label: '德意志' }] },
      b: { label: '法兰西第二帝国', polities: [{ name: 'France', label: '法国' }] },
    },
    summary:
      '1870 年西班牙王位继承问题引发普法冲突，普军迅速攻入法国。色当战役俘虏拿破仑三世，梅斯投降，1871 年巴黎围城后签订《法兰克福和约》：法国割让阿尔萨斯-洛林并赔款 50 亿法郎，德意志帝国在凡尔赛宫宣告成立。',
    battles: [
      { year: 1870, name: '色当', lon: 4.94, lat: 49.7 },
      { year: 1870, name: '梅斯', lon: 6.18, lat: 49.12 },
      { year: 1871, name: '巴黎', lon: 2.35, lat: 48.86 },
    ],
    outcome: '法国战败，德意志帝国成立；阿尔萨斯-洛林与赔款埋下法德长期对立。',
    note: '地图快照 1880 年，用于呈现统一后的德意志帝国；战争发生于 1870–71 年。',
    sources: [
      { label: '《世界史·近代史编》下卷（第2版），第五章第一节“俾斯麦与德国的统一”' },
      { label: 'Wikipedia · 普法战争', url: 'https://zh.wikipedia.org/wiki/普法战争' },
    ],
  },
  {
    id: 'russo-turkish-war-1877',
    name: '俄土战争',
    start: 1877,
    end: 1878,
    snapshot: 1880,
    sides: {
      a: { label: '俄国—罗马尼亚—塞尔维亚—黑山', polities: [{ name: 'Russian Empire', label: '俄国' }, { name: 'Romania', label: '罗马尼亚' }, { name: 'Serbia', label: '塞尔维亚' }, { name: 'Montenegro', label: '黑山' }] },
      b: { label: '奥斯曼帝国', polities: [{ name: 'Ottoman Empire', label: '奥斯曼帝国' }] },
    },
    summary:
      '1877 年俄国以保护巴尔干东正教徒为由对奥斯曼宣战，普列文围城后俄军越过巴尔干山脉，逼近君士坦丁堡。1878 年《圣斯特凡诺和约》遭列强反对，柏林会议重划巴尔干，保加利亚自治、塞尔维亚与罗马尼亚独立。',
    battles: [
      { year: 1877, name: '普列文', lon: 24.87, lat: 43.42 },
      { year: 1878, name: '圣斯特凡诺', lon: 28.85, lat: 40.98 },
      { year: 1878, name: '柏林', lon: 13.4, lat: 52.52 },
    ],
    outcome: '奥斯曼帝国在巴尔干大幅退却；保加利亚自治，塞、罗、黑独立，奥匈与俄国在巴尔干的竞争加剧。',
    note: '地图快照 1880 年，用于呈现柏林会议后的巴尔干格局。',
    sources: [
      { label: '《世界史·近代史编》下卷（第2版），第六章第二节“1871—1900年的国际关系”' },
      { label: 'Wikipedia · 俄土战争 (1877—1878)', url: 'https://zh.wikipedia.org/wiki/俄土战争_(1877年—1878年)' },
    ],
  },
];
