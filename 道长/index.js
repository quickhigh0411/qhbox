/**
 pathLib: {
  join: [Function: join],
  dirname: [Function: dirname],
  readDir: [Function (anonymous)],
  readFile: [Function (anonymous)],
  stat: [Function (anonymous)]
}
 path
 path_dir
 **/
function naturalSort(arr, key) {
    return arr.sort((a, b) => a[key].localeCompare(b[key], undefined, {numeric: true, sensitivity: 'base'}));
}

async function main() {
  //  let js_order = ['360影视[官]', '菜狗[官]', '奇珍异兽[官]', '优酷[官]', '腾云驾雾[官]', '百忙无果[官]', '哔哩影视[官]', '采集之王[合]', '采王道长[合]'];
 //将custom.json里的 https://wogg.link/ 已经失效 改为https://www.wogg.net/
    let js_order = ['🇵本地','🇵网盘及彈幕配置','🧑豆瓣[官]', '🎁采王道长[合]', '🎁直播转点播[合]'];
    let js_path = './drpy_js';
    let live_path = './lives';
    let config_path = './custom.json';
    let appv2_path = './appv2.txt';
    let js_api = './drpy_libs/drpy2.min.js';
    let parse_apis = [
        '虾米,https://jx.xmflv.com/?url=,0',
        '虾米2,https://jx.xmflv.cc/?url=,0',
		'zhuimi-super,http://103.38.82.59:9527/zhuimi666.php?url=,1',
		'zhuimi-1080,https://jxjson.icu/neibu.php?url=,1',				
        '-777-,https://jx.777jiexi.com/player/?url=,0',
        '-全看-,https://jx.quankan.app/?url=,0',
        '-云解析-,https://jx.yparse.com/index.php?url=,0',
		'极速,https://jx.2s0.cn/player/?url=,0',	
        'o112,https://www.o112.com/jx/?url=,0',
    ];
    let parses = parse_apis.map((it) => {
        let _name = it.split(',')[0];
        let _url = it.split(',')[1];
        let _type = it.split(',').length > 2 ? it.split(',')[2] : '0';
        _type = Number(_type);
        return {
            name: _name,
            url: _url,
            type: _type,
            'ext': {
                'flag': [
                    'qiyi',
                    'imgo',
                    '爱奇艺',
                    '奇艺',
                    'qq',
                    'qq 预告及花絮',
                    '腾讯',
                    'youku',
                    '优酷',
                    'pptv',
                    'PPTV',
                    'letv',
                    '乐视',
                    'leshi',
                    'mgtv',
                    '芒果',
                    'sohu',
                    'xigua',
                    'fun',
                    '风行',
                ],
            },
            'header': {
                'User-Agent': 'Mozilla/5.0',
            },
        };

    });
	
	
    let js_files = pathLib.readDir(pathLib.join(path_dir, js_path)).filter(file => file && file.endsWith('.js'));
    // console.log(js_files);
    let live_files = pathLib.readDir(pathLib.join(path_dir, live_path));
    // console.log(live_files);
    let config_sites = [];
    try {
        let config_file = pathLib.readFile(pathLib.join(path_dir, config_path));
        config_sites = JSON.parse(config_file).sites;
    } catch (e) {
        console.log(`get config_file error:${e.message}`);
    }
	
	 let appv2_sites = [];
    let appv2_abspath = pathLib.join(path_dir, appv2_path);
	
	 try {
        let appv2_file = String(pathLib.readFile(appv2_abspath));
        appv2_sites = appv2_file.split('\n').filter(_l => _l.trim() && !/^(#|\/\/)/.test(_l.trim())).map(_s => _s.trim());
    } catch (e) {
         console.log(`get appv2_path error:${e.message}`);
    }
	
    let channels = [];
    channels.push(
		{
          "name": "本地直播",
          "type":"0",
          "pass": true,
          "url":"./lives/itvlist.txt",
          "epg": "https://epg.112114.xyz/?ch={name}&date={date}",     
          "logo": "https://epg.112114.xyz/logo/{name}.png"
        },		
		{
          "name": "天微直播",
          "type":"0",
          "pass": true,
          "url":"https://tvkj.top/tvlive.txt",
          "epg": "https://epg.112114.xyz/?ch={name}&date={date}",     
          "logo": "https://epg.112114.xyz/logo/{name}.png"
        },
		{
          "name": "天微直播(新)",
          "type":"0",
          "pass": true,
          "url":"https://gitlab.com/tvtg/vip/-/raw/main/log.txt",
          "epg": "https://epg.112114.xyz/?ch={name}&date={date}",     
          "logo": "https://epg.112114.xyz/logo/{name}.png"
        },
		{
          "name": "央卫地",
          "type":"0",
          "pass": true,
          "url":"https://mirror.ghproxy.com/https://raw.githubusercontent.com/joevess/IPTV/main/sources/iptv_sources.m3u8",
          "epg": "https://epg.112114.xyz/?ch={name}&date={date}",     
          "logo": "https://epg.112114.xyz/logo/{name}.png"
        },		
		{
          "name": "稳定直播",
          "type":"0",
          "pass": true,
          "url":"https://mirror.ghproxy.com/https://raw.githubusercontent.com/ssili126/tv/main/itvlist.txt",
          "epg": "https://epg.112114.xyz/?ch={name}&date={date}",     
          "logo": "https://epg.112114.xyz/logo/{name}.png"
        },{
          "name": "❓·神秘订阅",
          "type":"0",
          "pass": true,
          "url":"https://tv.iill.top/m3u/Adult",
          "epg": "https://epg.112114.xyz/?ch={name}&date={date}",     
          "logo": "https://epg.112114.xyz/logo/{name}.png"
        }
     
    );
	/*
    live_files.forEach((it) => {
        let absp = pathLib.join(path_dir, `${live_path}/${it}`).replace(/\\/g, '/');
        if (absp.includes('/zyplayer/file/')) {
            absp = 'http://127.0.0.1:9978/api/v1/file/' + absp.split('/zyplayer/file/')[1];
        }
        let aname = it.split('.')[0];
        channels.push(
      
        {
          "name": aname,
          "type": 0,
          "url": absp,
          "playerType": 1,
          "ua": "okhttp/3.15",
          "epg": "http://epg.112114.xyz/?ch={name}&date={date}",
          "logo": "https://epg.112114.xyz/logo/{name}.png"
        }
        );
    });
    channels = channels.concat([
    
        {
            'name': '云星日记直播',
            'urls': [
                'proxy://do=live&type=txt&ext=http://itvbox.cc/云星日记/Ipv4.txt',
            ],
        },
        {
            'name': '本地嗅探器直播',
            'urls': [
                'proxy://do=live&type=txt&ext=http://127.0.0.1:5708/ysp',
            ],
        }
        
    ]);
	*/
    let json_config = {
        'wallpaper': 'https://tuapi.eees.cc/api.php?category=fengjing&type=302',
        'homepage': 'https://github.com/hjdhnx/hipy-server',
        "homeLogo": "./img/logo500x200-1.png",
        "spider": "./jar/pg.jar?md5=7633f8ea346c082b7aa163be58aed023",
        'sites': [],
        'parses': parses,
        'flags': [
            'imgo',
            'youku',
            'qq',
            'qq 预告及花絮',
            'iqiyi',
            'qiyi',
            'fun',
            'letv',
            'leshi',
            'sohu',
            'tudou',
            'xigua',
            'cntv',
            '1905',
            'pptv',
            'mgtv',
            'wasu',
            'bilibili',
            'renrenmi',
        ],
        'lives': 
        channels
        
        /*
        'lives': [
            {
                'group': 'redirect',
                'channels': channels,
            },
        ],
*/

    };
    js_files.forEach((it, index) => {
        let rname = it.replace('.js', '');
        let extras = [''];
        
		 if (rname.includes('我的哔哩[官]')) {
            extras = [
                '?type=url&params=../json/哔哩教育.json@哔哩教育[教]',
				'?type=url&params=../json/少儿教育.json@少儿┃教育[教]',
				'?type=url&params=../json/小学教育.json@小学┃课堂[教]',
				'?type=url&params=../json/初中课堂.json@初中┃课堂[教]',
				'?type=url&params=../json/高中课堂.json@高中┃课堂[教]',
                '?type=url&params=../json/哔哩大全.json@哔哩大全[官]',
            ];
        } else if (rname.includes('采集之王')) {
            extras = [
                '?type=url&params=../json/采集静态.json$1@采王道长[合]',
                '?type=url&params=../json/采集[zy]静态.json$1@采王zy[密]',
                '?type=url&params=../json/采集[密]静态.json@采王成人[密]',
            ];
        } else if (rname.includes('直播转点播')) {
            extras = [
                '?type=url&params=../json/live2cms.json',
            ];
        } else if (rname.includes('APPV2')) {
            extras = appv2_sites.map(s => `?type=url&params=${s}`);
        }

        let excludes = [];
        if (!excludes.includes(rname)) {
            extras.forEach((extra, index) => {
                let ext_str = 'drpy_t3';
                let _name = extras.length > 1 ? `${rname}${index}` : `${rname}`;
                let ext_name = extra.includes('@') ? extra.split('@')[1] : _name;
                extra = extra.split('@')[0];
                if (extra) {
                    try {
                        ext_str = extra.split('/').slice(-1)[0].split('.')[0];
                    } catch (e) {
                    }
                }
                ext_name = ext_name || `${rname}(${ext_str})`;
                let data = {
                    'key': extras.length > 1 ? `hipy_js_${rname}${index}` : `hipy_js_${rname}`,
                    'name': `${ext_name}`,// (drpy_t3)
                    'type': 3,
                    'api': js_api,
                    'searchable': 1,
                    'quickSearch': 1,
                    'filterable': 1,
                    'order_num': index,
                    'ext': `${js_path}/${it}${extra}`,
                };
                json_config.sites.push(data);
            });

        }
    });
json_config.sites = json_config.sites.map(site => {
  let newName = site.name;

  if (/\[短\]|短/.test(newName)) {
    newName = '📲' + newName;
  } else if (newName.includes('[优]')) {
    newName = '🏆' + newName;
  } else if (newName.includes('[听]')) {
    newName = '🎧' + newName;
  } else if (newName.includes('[官]')) {
    newName = '🧑' + newName;
  }  else if (newName.includes('[教]')) {
    newName = '📚' + newName;
  } else if (newName.includes('[书]')) {
    newName = '📚' + newName;
  } else if (newName.includes('[合]')) {
    newName = '🎁' + newName;
  } else if (newName.includes('[漫]')) {
    newName = '💮' + newName;
  } else if (newName.includes('[盘]')) {
    newName = '💾' + newName;
  } else if (newName.includes('[球]')) {
    newName = '⚽' + newName;
  } else if (newName.includes('[飞]')) {
    newName = '✈️' + newName;
  } else if (newName.includes('[磁]')) {
    newName = '🧲' + newName;
  } else if (newName.includes('[虫]')) {
    newName = '🐞' + newName;
  } else if (/\[自动\]|\(自动\)/.test(newName)) {
    newName = '🤖' + newName;
  } else if (newName.includes('[资]')) {
    newName = '♻️' + newName;
  } else if (newName.includes('[儿]')) {
    newName = '👶' + newName;
  } else if (newName.includes('[V2]')) {
    newName = '🔱' + newName;
  } else if (newName.includes('[搜]')) {
    newName = '🔎' + newName;
  } else if (newName.includes('[播]')) {
    newName = '▶️' + newName;
  } else if (newName.includes('[密]')) {
    newName = '🚫' + newName;
  } else if (newName.includes('[画]')) {
    newName = '🖼️' + newName;
  } else if (newName.includes('[慢]')) {
    newName = '🐢' + newName;
  } else if (site['key'].startsWith('hipy_js')) { 
    newName = '📺' + newName; 
  } else  {
    newName = '' + newName; 
  }

  site.name = newName;
  return site;
});



config_sites = config_sites.map(site => {
  let newName = site.name;
  newName = '🇵' + newName; // 没有则加上 '🇵'
  site.name = newName;
  return site;
});

pg_config = config_sites;

json_config.sites = json_config.sites.concat(config_sites);

// 从 json_config.sites 中删除名称带 '[密]' 的站点  
//json_config.sites = json_config.sites.filter(site =>!site.name.includes('[密]'));
json_config.sites = json_config.sites.filter(site =>!site.name.includes('[画]')).filter(site =>!site.name.includes('[书]')).filter(site =>!site.name.includes('[飞]'));



function customSort(a, b) {
  let i = js_order.indexOf(a.name.split('(')[0]);
  let j = js_order.indexOf(b.name.split('(')[0]);

  // 先按照 js_order 排序
  if (i!== -1 && j!== -1) {
    return i - j;
  } else if (i!== -1) {
    return -1;
  } else if (j!== -1) {
    return 1;
  }
//筛选
  const regex = /(\[|【)(官|教|优|听|书|短|漫|画|合|资|自动|V2|球|飞|磁|儿|搜|盘|虫|播|慢)(\]|】)|短|📺|(自动)/;

  const matchA = a.name.match(regex);
  const matchB = b.name.match(regex);
//排序   可自行修改
  if (matchA && matchB) {
    const order = ['[官]', '[搜]', '[盘]','[教]', '[合]', '[优]','📺', '[短]','短', '[资]', '[自动]','自动', '[V2]', '[漫]', '[儿]', '[磁]', '[虫]', '[播]', '[球]', '[飞]', '[慢]', '[听]', '[画]', '[书]'];

    const indexA = order.indexOf(matchA[0]);
    const indexB = order.indexOf(matchB[0]);

    if (indexA!== indexB) {
      return indexA - indexB;
    }
  } else if (matchA) {
    return -1;
  } else if (matchB) {
    return 1;
  }

  // 如果都不是正则匹配的部分，按名称排序
  let compareResult = a.name.localeCompare(b.name);
  
  

  // 单独处理“密”的匹配
  const regexForMiA = /(\[|【)密(\]|】)/;
  const matchAMi = a.name.match(regexForMiA);

  const regexForMiB = /(\[|【)密(\]|】)/;
  const matchBMi = b.name.match(regexForMiB);

  if (matchAMi &&!matchBMi) {
    compareResult = 1;
  } else if (!matchAMi && matchBMi) {
    compareResult = -1;
  }

  return compareResult;
}
//json_config.sites.sort(customSort);

 json_config.sites.push(
 {
        "key": "🔞優優采集",
        "name": "🔞優優采集[密]",
        "type": 1,
        "api": "https://jk1.yycmszywapi.cc/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞絲襪采集",
        "name": "🔞絲襪采集[密]",
        "type": 1,
        "api": "https://www.siwazyw.tv/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞愛豆傳媒",
        "name": "🔞愛豆傳媒[密]",
        "type": 1,
        "api": "http://chujia.cc/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞精品采集",
        "name": "🔞精品采集[密]",
        "type": 1,
        "api": "https://www.jingpinx.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞滴滴采集",
        "name": "🔞滴滴采集[密]",
        "type": 1,
        "api": "https://api.ddapi.cc/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞橘貓影視",
        "name": "🔞橘貓影視[密]",
        "type": 1,
        "api": "https://to.to-long.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞濕樂園",
        "name": "🔞濕樂園[密]",
        "type": 1,
        "api": "https://xxavs.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞越南采集",
        "name": "🔞越南采集[密]",
        "type": 1,
        "api": "https://vnzyz.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞色南國",
        "name": "🔞色南國[密]",
        "type": 1,
        "api": "https://api.sexnguon.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞JKUN",
        "name": "🔞JKUN[密]",
        "type": 1,
        "api": "https://jkunzyapi.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞七天成人",
        "name": "🔞七天成人[密]",
        "type": 1,
        "api": "https://8day.icu/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞蘿莉采集",
        "name": "🔞蘿莉采集[密]",
        "type": 1,
        "api": "https://192.151.223.213/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞色色虎",
        "name": "🔞色色虎[密]",
        "type": 1,
        "api": "https://apisesehuzy.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞奶香香",
        "name": "🔞奶香香[密]",
        "type": 1,
        "api": "https://naixxzy.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞阿里BB",
        "name": "🔞阿里BB[密]",
        "type": 1,
        "api": "https://bbckzy8.cc/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞森林采集",
        "name": "🔞森林采集[密]",
        "type": 1,
        "api": "https://slapibf.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞玉兔采集",
        "name": "🔞玉兔采集[密]",
        "type": 1,
        "api": "https://apiyutu.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞奧斯卡",
        "name": "🔞奧斯卡[密]",
        "type": 1,
        "api": "https://aosikazy.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞老色逼",
        "name": "🔞老色逼[密]",
        "type": 1,
        "api": "https://apilsbzy1.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞KK倫理",
        "name": "🔞KK倫理[密]",
        "type": 1,
        "api": "https://kkzy.me/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞樂播采集",
        "name": "🔞樂播采集[密]",
        "type": 1,
        "api": "https://lbapi9.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞番號采集",
        "name": "🔞番號采集[密]",
        "type": 1,
        "api": "http://fhapi9.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞探探采集",
        "name": "🔞探探采集[密]",
        "type": 1,
        "api": "https://apittzy.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞老鴨采集",
        "name": "🔞老鴨采集[密]",
        "type": 1,
        "api": "https://api.apilyzy.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞155采集",
        "name": "🔞155采集[密]",
        "type": 1,
        "api": "https://155api.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞易看采集",
        "name": "🔞易看采集[密]",
        "type": 1,
        "api": "https://api.yikanapi.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞優異采集",
        "name": "🔞優異采集[密]",
        "type": 1,
        "api": "https://a.uezy.pw/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞CK采集",
        "name": "🔞CK采集[密]",
        "type": 1,
        "api": "https://ckzy.me/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞草榴采集",
        "name": "🔞草榴采集[密]",
        "type": 1,
        "api": "https://www.caoliuzyw.com/api.php/provide/vod/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
	{
        "key": "🔞色猫采集",
        "name": "🔞色猫采集[密]",
        "type": 0,
        "api": "https://dadiapi.com/api.php",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
	{
        "key": "🔞大地采集",
        "name": "🔞大地采集[密]",
        "type": 1,
        "api": "https://caiji.semaozy.net/inc/apijson_vod.php/",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞白嫖资源",
        "name": "🔞白嫖资源[密]",
        "type": 0,
        "api": "https://www.kxgav.com/api/xml.php",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞香奶儿资源",
        "name": "🔞香奶儿资源[密]",
        "type": 0,
        "api": "https://www.gdlsp.com/api/xml.php",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞淫水机资源",
        "name": "🔞淫水机资源[密]",
        "type": 0,
        "api": "https://www.xrbsp.com/api/xml.php",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞黄AV资源",
        "name": "🔞黄AV资源[密]",
        "type": 0,
        "api": "https://www.pgxdy.com/api/xml.php",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    },
    {
        "key": "🔞美少女资源",
        "name": "🔞美少女资源[密]",
        "type": 0,
        "api": "https://www.msnii.com/api/xml.php",
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1
    }
 );

json_config.sites = Array.from(new Set(json_config.sites.sort(customSort).concat(pg_config)));


//return JSON.stringify(json_config, null, "\t");



 let jsonString = JSON.stringify(json_config);
jsonString = jsonString

.replace('{"', '{\n"')
 .replace(',"si', ',\n"si')
 .replace(',"l', ',\n"l')
 .replaceAll(',"u', ',   "u')
 .replaceAll('3,"', '3,   "')
 .replaceAll('1,"', '1,   "')
 .replaceAll('0,"', '0,   "')
 .replaceAll(',"n', ',   "n')
 .replace(',"sp', ',\n"sp')
 .replaceAll('[{', '[\n{')
 .replaceAll('],', '],\n')
 .replaceAll('","h', '",\n"h')
 .replaceAll('},{"', '},\n{"')
 .replaceAll('}]}', '}]\n}')
 .replaceAll('],', '],\n');
return jsonString;


}
