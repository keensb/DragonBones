/**
 * Created by YeXin on 2016/2/3.
 */
module modules
{
    export class DragonBonesArmature
    {
        public static dragonbonesFactory: dragonBones.EgretFactory;
        constructor(displayContainer:egret.DisplayObjectContainer)
        {
            //获取并持有骨骼动画信息、纹理信息和纹理集图片资源
            if(!DragonBonesArmature.dragonbonesFactory)//相同数据内容的龙骨工厂不需要创建2次或2次以上，创建1次后可以持有其引用，用于继续创建副本
            {
                //注意有5个名称不能写错，还要注意大小写
                var dragonbonesData = RES.getRes("fireLord");//①骨骼动作文件名称
                var textureData = RES.getRes("fireLord_json");//②纹理集信息文件名称
                var texture = RES.getRes("fireLord_png");//③纹理集图片文件名称
                
                //创建龙骨动画工厂对象
                DragonBonesArmature.dragonbonesFactory = new dragonBones.EgretFactory();
                //解析骨骼动画信息, 并添加到龙骨动画工厂的数据列表
                DragonBonesArmature.dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
                //把骨骼动画所需要的纹理集资源添加到工厂纹理集列表中
                DragonBonesArmature.dragonbonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
            }
            var dragonbonesFactory: dragonBones.EgretFactory = DragonBonesArmature.dragonbonesFactory;

            //创建一个可视的骨架对象(注意：是骨“架”，不是骨“骼”，骨骼是构成骨架的基本元素)
            //一般情况下出现报错 'display' of null 是因为骨架名称有误
            var armature:dragonBones.Armature = dragonbonesFactory.buildArmature("armatureName");//④骨架名称(这个最容易被忽略)
            
            //把骨架对象的可视对象添加到舞台
            displayContainer.addChild(armature.display);

            //动画坐标位置和图像大小设置
            armature.display.x = 600;
            armature.display.y = 600;
            armature.display.scaleX = 0.5;
            armature.display.scaleY = 0.5;
            armature.display.anchorOffsetX = 0;
            armature.display.anchorOffsetY = 0;

            

            armature.animation.timeScale = 1;//设置时间缩放比例，越大越快

            //一般情况下出现类似 'setCurrentTime' of null 报错是因为动作名有误
            var anms:dragonBones.AnimationState = armature.animation.gotoAndPlay("win",-1);//⑤参数1是动作关键帧标签名称，参数2是切换动作淡入（自动完成过渡动画补间）时间：默认值-1表示使用默认的数据时间 。淡入可以使动作细腻，但是容易造成骨骼“走位”。
            anms.setPlayTimes(0);//设置循环次数，0为无限循环
            anms.setCurrentTime(0);//设置当前时间播放头，单位：秒(龙骨工具用“秒”而不用“帧”来控制播放头的位置?)
            anms.setTimeScale(1);//设置动作速度比例，越大越快(注意不同版本的数据文件，默认值也不相同)

            //dragonBones.AnimationState是一个装饰者模式的结构，在被设置的同时一直持有并返回自身的引用
            //所以最简单的设置方法： armature.animation.gotoAndPlay("射击").setPlayTimes(0).setCurrentTime(1).setTimeScale(1);


            //trace(anms.totalTime)//动画时间总长，单位：秒
            
            //把骨架加入世界钟的控制列表，所有的龙骨动画都必须加入世界钟，但是一个在 egret.startTick 函数中同步世界钟的事件就可以驱动全局所有龙骨动画。
            dragonBones.WorldClock.clock.add(armature);
            
            //egret的同步事件(官方建议使用，理由是效率较高，另外似乎在慢镜头下比较细腻一些)
            /*egret.startTick(
                function (frameTime:number)
                {
                    //目前web最高帧频是 60 fps，每帧的驻留时间相当于 1/60 秒;
                    dragonBones.WorldClock.clock.advanceTime(1 / 60); //默认值为-1，自动计算播放速度(最短时间间隔 秒 也就是1/60)。

                    // (未证实的结论：实际循环时间 ≈ ((1/60) * 默认循环耗时) / (advanceTime参数 * 时间缩放比例 * 动作速度比例)。参数和比例越大播放速度越快。
                    //如果要放慢一倍速度，可以 dragonBones.WorldClock.clock.advanceTime(1/60/2);
                    //但是建议直接更改时间缩放比例或动作速度比例更直观 armature.animation.timeScale = 0.5 或 anms.setTimeScale(0.5);
                    return false;
                },
                displayContainer
            );*/
            //也可以使用帧同步
            //displayContainer.addEventListener(egret.Event.ENTER_FRAME,function(){ dragonBones.WorldClock.clock.advanceTime(0.05)},displayContainer);

            //龙骨动画的事件
            //armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE,function(){trace("播放完一轮的事件");},displayContainer);
        }
    }
}
