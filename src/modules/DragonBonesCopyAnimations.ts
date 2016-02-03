/**
 * Created by YeXin on 2016/2/3.
 */
/**
 * Created by YeXin on 2016/2/3.
 */
module modules
{
    export class DragonBonesCopyAnimations
    {
        constructor(displayContainer:egret.DisplayObjectContainer)
        {
            //获取并持有骨骼动画信息、纹理信息和纹理集图片资源
            /* var dragonbonesData = RES.getRes("unicorn");
             var textureData = RES.getRes("unicorn_json");
             var texture = RES.getRes("unicorn_png");
             */
            var dragonbonesData = RES.getRes("fireLord");
            var textureData = RES.getRes("fireLord_json");
            var texture = RES.getRes("fireLord_png");

            //创建龙骨动画工厂对象
            var dragonbonesFactory:dragonBones.EgretFactory = new dragonBones.EgretFactory();

            //解析骨骼动画信息, 并添加到龙骨动画工厂的数据列表
            dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
            //把骨骼动画所需要的纹理集资源添加到工厂纹理集列表中
            dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
            //创建一个可视的骨架对象(注意：是骨“架”，不是骨“骼”，骨骼是构成骨架的基本元素)，
            var armature:dragonBones.Armature = dragonbonesFactory.buildArmature("armatureName");
            //把骨架对象的可视对象添加到舞台
            displayContainer.addChild(armature.display);

            //动画坐标位置和图像大小设置
            armature.display.x = 600;
            armature.display.y = 600;
            armature.display.scaleX = 0.5;
            armature.display.scaleY = 0.5;
            armature.display.anchorOffsetX = 0;
            armature.display.anchorOffsetY = 0;

            //把骨架加入世界钟的控制列表
            dragonBones.WorldClock.clock.add(armature);
            //选择骨架的所要播放的动画名称

            armature.animation.timeScale = 1;//设置时间缩放比例，越大越快
            var anms:dragonBones.AnimationState = armature.animation.gotoAndPlay("hit");
            anms.setPlayTimes(0);//设置循环次数，0为无限循环
            anms.setCurrentTime(0);//设置当前时间播放头，单位：秒(龙骨工具用“秒”而不用“帧”来控制播放头的位置?)
            anms.setTimeScale(0.5);//设置动作速度比例，越大越快

            //dragonBones.AnimationState是一个装饰者模式的结构，在被设置的同时一直持有并返回自身的引用
            //所以最简单的设置方法： armature.animation.gotoAndPlay("射击").setPlayTimes(0).setCurrentTime(1).setTimeScale(1);


            //trace(anms.totalTime)//动画时间总长，单位：秒

            //egret的同步事件(官方建议使用，理由是效率较高，另外似乎在慢镜头下比较细腻一些)
            egret.Ticker.getInstance().register(
                function (frameTime:number)
                {
                    //目前web最高帧频是 60 fps，每帧的驻留时间相当于 1/60 秒;
                    dragonBones.WorldClock.clock.advanceTime(1 / 60); //默认值为-1，自动计算播放速度(最短时间间隔 秒 也就是1/60)。

                    // (未证实的结论：时间循环时间 = ((1/60) * 默认循环时间) / (advanceTime参数 * 时间缩放比例 * 动作速度比例)。参数和比例越大播放速度越快。
                    //如果要放慢一倍速度，可以 dragonBones.WorldClock.clock.advanceTime(1/60/2);
                    //但是建议直接更改时间缩放比例或动作速度比例更直观 armature.animation.timeScale = 0.5 或 anms.setTimeScale(0.5);
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