/**
 * Created by YeXin on 2016/2/3.
 */
module modules
{
    export class DragonBonesFastArmature
    {
        constructor(displayContainer:egret.DisplayObjectContainer)
        {
            //获取并持有骨骼动画信息、纹理信息和纹理集图片资源
            //注意有5个名称不能写错，还要注意大小写
            var dragonbonesData = RES.getRes("unicorn");//①骨骼动作文件名称
            var textureData = RES.getRes("unicorn_json");//②纹理集信息文件名称
            var texture = RES.getRes("unicorn_png");//③纹理集图片文件名称

            //创建龙骨动画工厂对象
            var dragonbonesFactory:dragonBones.EgretFactory = new dragonBones.EgretFactory();

            //解析骨骼动画信息, 并添加到龙骨动画工厂的数据列表
            dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
            //把骨骼动画所需要的纹理集资源添加到工厂纹理集列表中
            dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //创建一个可视的骨架FastArmature对象(注意：是骨“架”，不是骨“骼”，骨骼是构成骨架的基本元素)
            //一般情况下出现报错 'display' of null 是因为骨架名称有误
            var armature:dragonBones.FastArmature = dragonbonesFactory.buildFastArmature("armatureName"); //④骨架名称(这个最容易被忽略)


            armature.enableAnimationCache(30, null, true);  //开启数据缓存，30代表采样帧频，推荐设置为12~30，达到性能和动画流畅度的最佳平衡点。;第二个参数是缓存动画列表，为null时所有动画均生成缓存，第三个参数是是否循环，仅对DragonBones 3.0以下的旧数据类型有效

            //把骨架对象的可视对象添加到舞台
            displayContainer.addChild(armature.display)


            //动画坐标位置和图像大小设置
            armature.display.x = 600;
            armature.display.y = 300;
            armature.display.scaleX = 0.5;
            armature.display.scaleY = 0.5;
            armature.display.anchorOffsetX = 0;
            armature.display.anchorOffsetY = 0;

            //把骨架加入世界钟的控制列表
            dragonBones.WorldClock.clock.add(armature);

            armature.animation.timeScale = 0.2;//设置时间缩放比例，越大越快

            //一般情况下出现类似 'setCurrentTime' of null 报错是因为动作名有误
            var anmfs:dragonBones.FastAnimationState = armature.animation.gotoAndPlay("射击");//⑤动画关键帧标签名称

            //anmfs.setCurrentTime(2);//设置当前时间播放头，单位：秒(龙骨工具不用“帧”来控制播放头的位置?)

            //trace(anmfs.playTimes)
            //trace(anmfs.totalTime)//动画时间总长，单位：秒


            //egret的同步事件(官方建议使用，理由是效率较高，另外似乎在慢镜头下比较细腻一些)
            egret.startTick(
                function (frameTime:number)
                {
                    //===============注意一下：极速模式下似乎没有 动作速度比例 这个属性，但是有 时间缩放比例 这个属性已经足够了===============
                    //目前web最高帧频是 60 fps，每帧的驻留时间相当于 1/60 秒;
                    dragonBones.WorldClock.clock.advanceTime(1 / 60);//默认值为-1，自动计算播放速度(最短时间间隔 秒 也就是1/60)。

                    // (未证实的结论：实际循环时间 约等于 ((1/60) * 默认循环耗时) / (advanceTime参数 * 时间缩放比例) 。参数和比例越大播放速度越快。
                    //如果要放慢一倍速度，可以 dragonBones.WorldClock.clock.advanceTime(1/60/2);
                    //或者更改时间缩放比例 armature.animation.timeScale = 0.5
                    return false;
                },
                displayContainer
            );
            //也可以使用帧同步
            //displayContainer.addEventListener(egret.Event.ENTER_FRAME,function(){ dragonBones.WorldClock.clock.advanceTime(0.05)},displayContainer);

            //龙骨动画的事件
            //armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE,function(){trace("播放完一轮的事件");},displayContainer);
        }
    }
}