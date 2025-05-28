var rule = {
    title: '哔哩影视[官]', // 源名称
    host: 'https://api.bilibili.com', // API 主机
    url: '/fyclass-fypage&vmid=$vmid', // 分类页面 URL
    detailUrl: '/pgc/view/web/season?season_id=fyid', // 详情页面 URL
    filter_url: 'fl={{fl}}', // 过滤器 URL
    vmid获取教程: '登录后访问 https://api.bilibili.com/x/web-interface/nav, 搜索 mid 就是, cookie 需要 bili_jct, DedeUserID, SESSDATA 参数', // vmid 获取说明
    searchUrl: '/x/web-interface/search/type?keyword=**&page=fypage&search_type=', // 搜索 URL
    searchable: 1, // 是否支持搜索
    filterable: 1, // 是否支持过滤
    quickSearch: 0, // 是否支持快速搜索
    headers: {
        'User-Agent': 'PC_UA', // 用户代理
        "Referer": "https://www.bilibili.com", // 引用来源
        "Cookie": "http://127.0.0.1:9978/file/TVBox/bilibili.txt" // Cookie 文件地址
    },
    tab_order: ['bilibili'], // 线路顺序
    timeout: 5000, // 请求超时设置
    play_parse: true,
    class_name: '番剧&国创&电影&电视剧&纪录片&综艺&全部&时间表', // 分类名称
    class_url: '1&4&2&5&3&7&全部&时间表', // 分类 URL
    filter: {
        "全部": [{
                key: "tid",
                name: "分类",
                value: [{
                        n: "番剧",
                        v: "1"
                    },
                    {
                        n: "国创",
                        v: "4"
                    },
                    {
                        n: "电影",
                        v: "2"
                    },
                    {
                        n: "电视剧",
                        v: "5"
                    },
                    {
                        n: "记录片",
                        v: "3"
                    },
                    {
                        n: "综艺",
                        v: "7"
                    }
                ]
            },
            {
                key: "order",
                name: "排序",
                value: [{
                        n: "播放数量",
                        v: "2"
                    },
                    {
                        n: "更新时间",
                        v: "0"
                    },
                    {
                        n: "最高评分",
                        v: "4"
                    },
                    {
                        n: "弹幕数量",
                        v: "1"
                    },
                    {
                        n: "追看人数",
                        v: "3"
                    },
                    {
                        n: "开播时间",
                        v: "5"
                    },
                    {
                        n: "上映时间",
                        v: "6"
                    }
                ]
            },
            {
                key: "season_status",
                name: "付费",
                value: [{
                        n: "全部",
                        v: "-1"
                    },
                    {
                        n: "免费",
                        v: "1"
                    },
                    {
                        n: "付费",
                        v: "2%2C6"
                    },
                    {
                        n: "大会员",
                        v: "4%2C6"
                    }
                ]
            }
        ],
        "时间表": [{
            key: "tid",
            name: "分类",
            value: [{
                    n: "番剧",
                    v: "1"
                },
                {
                    n: "国创",
                    v: "4"
                }
            ]
        }]
    },

    // 播放解析设置
    play_json: [{
        re: '*',
        json: {
            jx: 1,
            parse: 0,
            header: JSON.stringify({
                "user-agent": "PC_UA"
            })
        }
    }],

    // 各种分页计数
    pagecount: {
        "1": 1,
        "2": 1,
        "3": 1,
        "4": 1,
        "5": 1,
        "7": 1,
        "时间表": 1
    },

    lazy: '', // 懒加载
    limit: 5, // 限制数量

    // 推荐视频逻辑
    推荐: `js:
        let d = [];
        
        function get_result(url) {
            let videos = [];
            let html = request(url); // 发起请求
            let jo = JSON.parse(html); // 解析返回的 JSON
            
            // 检查返回码
            if (jo["code"] === 0) {
                let vodList = jo.result ? jo.result.list : jo.data.list;
                vodList.forEach(function(vod) {
                    let aid = (vod["season_id"] + "").trim(); // 视频 ID
                    let title = vod["title"].trim(); // 视频标题
                    let img = vod["cover"].trim(); // 封面图
                    let remark = vod.new_ep ? vod["new_ep"]["index_show"] : vod["index_show"]; // 视频备注
                    videos.push({ vod_id: aid, vod_name: title, vod_pic: img, vod_remarks: remark });
                });
            }
            return videos; // 返回视频列表
        }

        // 获取排行榜视频
        function get_rank(tid, pg) {
            return get_result("https://api.bilibili.com/pgc/web/rank/list?season_type=" + tid + "&pagesize=20&page=" + pg + "&day=3");
        }

        // 获取二级排行榜视频
        function get_rank2(tid, pg) {
            return get_result("https://api.bilibili.com/pgc/season/rank/web/list?season_type=" + tid + "&pagesize=20&page=" + pg + "&day=3");
        }

        // 获取主页视频
        function home_video() {
            let videos = get_rank(1).slice(0, 5); // 获取前 5 个视频
            [4, 2, 5, 3, 7].forEach(function(i) {
                videos = videos.concat(get_rank2(i).slice(0, 5)); // 合并排行榜视频
            });
            return videos; // 返回合并后的视频列表
        }

        VODS = home_video(); // 设置推荐视频
    `,

    // 一级分类处理逻辑
    一级: `js:
        let d = [];
        let vmid = input.split("vmid=")[1].split("&")[0]; // 获取 vmid

        function get_result(url) {
            let videos = [];
            let html = request(url); // 发起请求
            let jo = JSON.parse(html); // 解析返回的 JSON
            
            // 检查返回码
            if (jo["code"] === 0) {
                let vodList = jo.result ? jo.result.list : jo.data.list;
                vodList.forEach(function(vod) {
                    let aid = (vod["season_id"] + "").trim(); // 视频 ID
                    let title = vod["title"].trim(); // 视频标题
                    let img = vod["cover"].trim(); // 封面图
                    let remark = vod.new_ep ? vod["new_ep"]["index_show"] : vod["index_show"]; // 视频备注
                    videos.push({ vod_id: aid, vod_name: title, vod_pic: img, vod_remarks: remark });
                });
            }
            return videos; // 返回视频列表
        }

        // 获取排行榜视频
        function get_rank(tid, pg) {
            return get_result("https://api.bilibili.com/pgc/web/rank/list?season_type=" + tid + "&pagesize=20&page=" + pg + "&day=3");
        }

        // 获取二级排行榜视频
        function get_rank2(tid, pg) {
            return get_result("https://api.bilibili.com/pgc/season/rank/web/list?season_type=" + tid + "&pagesize=20&page=" + pg + "&day=3");
        }

        // 获取追番视频
        function get_zhui(pg, mode) {
            let url = "https://api.bilibili.com/x/space/bangumi/follow/list?type=" + mode + "&follow_status=0&pn=" + pg + "&ps=10&vmid=" + vmid;
            return get_result(url);
        }

        // 获取全部视频
        function get_all(tid, pg, order, season_status) {
            let url = "https://api.bilibili.com/pgc/season/index/result?order=" + order + "&pagesize=20&type=1&season_type=" + tid + "&page=" + pg + "&season_status=" + season_status;
            return get_result(url);
        }

        // 获取时间表视频
        function get_timeline(tid, pg) {
            let videos = [];
            let url = "https://api.bilibili.com/pgc/web/timeline/v2?season_type=" + tid + "&day_before=2&day_after=4";
            let html = request(url); // 发起请求
            let jo = JSON.parse(html); // 解析返回的 JSON

            // 检查返回码
            if (jo["code"] === 0) {
                let videos1 = [];
                let vodList = jo.result.latest;
                vodList.forEach(function(vod) {
                    let aid = (vod["season_id"] + "").trim(); // 视频 ID
                    let title = vod["title"].trim(); // 视频标题
                    let img = vod["cover"].trim(); // 封面图
                    let remark = vod["pub_index"] + "　" + vod["follows"].replace("系列", ""); // 视频备注
                    videos1.push({ vod_id: aid, vod_name: title, vod_pic: img, vod_remarks: remark });
                });

                let videos2 = [];
                for (let i = 0; i < 7; i++) {
                    let vodList = jo["result"]["timeline"][i]["episodes"];
                    vodList.forEach(function(vod) {
                        if (vod["published"] + "" === "0") { // 检查是否已发布
                            let aid = (vod["season_id"] + "").trim(); // 视频 ID
                            let title = vod["title"].trim(); // 视频标题
                            let img = vod["cover"].trim(); // 封面图
                            let date = vod["pub_ts"]; // 发布时间
                            let remark = date + "   " + vod["pub_index"]; // 视频备注
                            videos2.push({ vod_id: aid, vod_name: title, vod_pic: img, vod_remarks: remark });
                        }
                    });
                }
                videos = videos2.concat(videos1); // 合并视频
            }
            return videos; // 返回视频列表
        }

        // 分类过滤
        function cate_filter(d, cookie) {
            if (MY_CATE === "1") {
                return get_rank(MY_CATE, MY_PAGE);
            } else if (["2", "3", "4", "5", "7"].includes(MY_CATE)) {
                return get_rank2(MY_CATE, MY_PAGE);
            } else if (MY_CATE === "全部") {
                let tid = MY_FL.tid || "1"; // 分类 ID
                let order = MY_FL.order || "2"; // 排序方式
                let season_status = MY_FL.season_status || "-1"; // 付费状态
                return get_all(tid, MY_PAGE, order, season_status);
            } else if (MY_CATE === "追番") {
                return get_zhui(MY_PAGE, 1);
            } else if (MY_CATE === "追剧") {
                return get_zhui(MY_PAGE, 2);
            } else if (MY_CATE === "时间表") {
                let tid = MY_FL.tid || "1"; // 分类 ID
                return get_timeline(tid, MY_PAGE);
            } else {
                return []; // 返回空列表
            }
        }

        VODS = cate_filter(); // 设置一级分类视频
    `,

    // 二级分类处理逻辑
    二级: `js:
        // 函数用于数值转换（如亿、万）
        function zh(num) {
            let p = "";
            if (Number(num) > 1e8) {
                p = (num / 1e8).toFixed(2) + "亿";
            } else if (Number(num) > 1e4) {
                p = (num / 1e4).toFixed(2) + "万";
            } else {
                p = num;
            }
            return p; // 返回转换后的值
        }

        let html = request(input); // 发起请求
        let jo = JSON.parse(html).result; // 解析返回的 JSON
        let id = jo["season_id"]; // 获取季节 ID
        let title = jo["title"]; // 获取标题
        let pic = jo["cover"]; // 获取封面
        let areas = jo["areas"][0]["name"]; // 获取地区
        let typeName = jo["share_sub_title"]; // 获取副标题
        let date = jo["publish"]["pub_time"].substr(0, 4); // 获取年份
        let dec = jo["evaluate"]; // 获取评价
        let remark = jo["new_ep"]["desc"]; // 获取新章节描述
        let stat = jo["stat"]; // 获取统计信息

        // 构建状态字符串
        let status = "弹幕: " + zh(stat["danmakus"]) + "　点赞: " + zh(stat["likes"]) + "　投币: " + zh(stat["coins"]) + "　追番追剧: " + zh(stat["favorites"]);
        
        // 构建评分字符串
        let score = jo.hasOwnProperty("rating") ? "评分: " + jo["rating"]["score"] + "　" + jo["subtitle"] : "暂无评分" + "　" + jo["subtitle"];
        
        // 构建视频对象
        let vod = {
            vod_id: id,
            vod_name: title,
            vod_pic: pic,
            type_name: typeName,
            vod_year: date,
            vod_area: areas,
            vod_remarks: remark,
            vod_actor: status,
            vod_director: score,
            vod_content: dec
        };

        // 获取播放链接
        let ja = jo["episodes"]; // 获取章节列表
        let playurls = [];
        ja.forEach(function(tmpJo) {
            let eid = tmpJo["id"]; // 章节 ID
            let cid = tmpJo["cid"]; // 弹幕 ID
            let link = tmpJo["link"] + "&cid=" + cid; // 播放链接
            let part = tmpJo["title"].replace("#", "-") + " " + tmpJo["long_title"]; // 处理标题
            playurls.push(part + "$" + link); // 构建播放链接
        });

        let playUrl = playurls.join("#"); // 连接播放链接
        vod["vod_play_from"] = "bilibili"; // 设置播放来源
        vod["vod_play_url"] = playUrl; // 设置播放链接

        VOD = vod; // 设置返回的视频对象
    `,

    // 搜索逻辑
    搜索: `js:
        let url1 = input + "media_bangumi"; // 搜索番剧的 URL
        let url2 = input + "media_ft"; // 搜索电影的 URL
        let html = request(url1); // 发起请求
        let msg = JSON.parse(html).message; // 解析返回的消息

        // 检查返回消息
        if (msg !== "0") {
            VODS = [{
                vod_name: KEY + "➢" + msg,
                vod_id: "no_data",
                vod_remarks: "别点,缺少bili_cookie",
                vod_pic: "https://ghproxy.net/https://raw.githubusercontent.com/hjdhnx/dr_py/main/404.jpg"
            }];
        } else {
            let jo1 = JSON.parse(html).data; // 解析番剧数据
            html = request(url2); // 发起请求
            let jo2 = JSON.parse(html).data; // 解析电影数据
            let videos = [];
            let vodList = [];
            
            // 合并搜索结果
            if (jo1["numResults"] === 0) {
                vodList = jo2["result"];
            } else if (jo2["numResults"] === 0) {
                vodList = jo1["result"];
            } else {
                vodList = jo1["result"].concat(jo2["result"]);
            }

            // 构建视频列表
            vodList.forEach(function(vod) {
                let aid = (vod["season_id"] + "").trim(); // 视频 ID
                let title = KEY + "➢" + vod["title"].trim().replace('<em class="keyword">', "").replace("</em>", ""); // 视频标题
                let img = vod["cover"].trim(); // 封面图
                let remark = vod["index_show"]; // 视频备注
                videos.push({ vod_id: aid, vod_name: title, vod_pic: img, vod_remarks: remark });
            });

            VODS = videos; // 设置返回的视频列表
        }
    `,

    // 懒加载处理
    lazy: $js.toString(() => {
        console.log("测试: " + input);
        if (input.includes("bilibili.com")) {
            // 从输入链接中提取 cid
            const cidMatch = input.match(/cid=(\d+)/);
            const cid = cidMatch ? cidMatch[1] : null; // 提取到的 cid

            if (cid) {
                input = {
                    jx: 1,
                    url: input,
                    parse: 0,
                    danmaku: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`, // 使用提取到的 cid
                    header: JSON.stringify({
                        "user-agent": "Mozilla/5.0"
                    })
                };
            }
        }
    })

};