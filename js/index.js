
function test(name) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/run.php?" + name,
            type: "GET",
            success: function (data) {
                resolve(data);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}
async function aa() {
    //1 通过歌手的mid获取他的所有的歌曲
    let result1 = await test("type=getSingerMusic&singerMID=000IBYF50SRnXP");
    var singerSong = JSON.parse(result1)
    //2 创建歌曲的名称和歌曲mid
    var Songdata = []
    //3 存入歌曲名称和歌曲的mid
    for (var i = 0; i < singerSong.data.songList.length; i++) {
        //属性
        let title = singerSong.data.songList[i].title
        //属性值
        let songmid = singerSong.data.songList[i].id
        Songdata.push({ title, songmid })
    }
    if (result1) {
        var mid = []
        for (var i = 0; i < Songdata.length; i++) {
            mid.push(Songdata[i].songmid)
        }
        mid = mid.join()
        // 3 获取到了所有的歌曲id之后获取他们的收藏量
        let result2 = await test(`type=getMusicFavNum&singerMID=${mid}`)
        result2 = JSON.parse(result2).data
        if (result2) {
            for (var a in result2) {
                for (var i in Songdata) {
                    if (a == Songdata[i].songmid) {
                        Songdata[i]['like'] = result2[a]
                    }
                }
            }
        }
    }
    // console.log(Songdata);
    //进行冒泡排序
    for (var ii = 0; ii < Songdata.length; ii++) {
        for (var jj = 0; jj < Songdata.length; jj++) {
            if (Songdata[ii].like > Songdata[jj].like) {
                [Songdata[ii], Songdata[jj]] = [Songdata[jj], Songdata[ii]]
            }
        }
    }
    //简析数据
    // console.log(Songdata);
    for (var iii = 0; iii < Songdata.length; iii++) {
        //注入页面
        $('.tagul').append(`<li> <span class="song">${Songdata[iii].title}</span> <span class="likes">${Songdata[iii].like}<i class="iconfont icon-xihuan"></i></span> </li>`)
    }
}
aa();

//更新时间
var now = new Date().toLocaleString('cn',{hour12:false})
$('.headtitle').html(now)
