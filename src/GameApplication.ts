//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class GameApplication extends egret.DisplayObjectContainer
{

    /**
     * 加载进度界面
     * Process interface loading
     */

    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event)
    {
        //设置加载进度界面
        //Config to load process interface

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/defaultRes.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void
    {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("bones");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void
    {
        this.createGameScene();
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void
    {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void
    {



        //读取骨骼动画数据文件里的关键信息，以树形结构输出控制台中
        DragonBonesDataTree.read("resource/assets/bones/robot2/skeleton.json", true);
        //关于创建
        //this.dragonbonesArmature();//一般模式，多用于玩家角色
        //this.dragonbonesFastArmature();//极速模式+数据缓存,不支持多个动画同时播放（动画融合），并且不支持大多动态控制，多用于非玩家角色

        //关于动态控制
        this.dragonbonesCopyAnimations();//拷贝骨骼动画
        
        egret.startTick(
            function(frameTime: number)
            {
                //目前web最高帧频是 60 fps，每帧的驻留时间相当于 1/60 秒;
                dragonBones.WorldClock.clock.advanceTime(1 / 60); //默认值为-1，自动计算播放速度(最短时间间隔 秒 也就是1/60)。

                // (未证实的结论：实际循环时间 ≈ ((1/60) * 默认循环耗时) / (advanceTime参数 * 时间缩放比例 * 动作速度比例)。参数和比例越大播放速度越快。
                //如果要放慢一倍速度，可以 dragonBones.WorldClock.clock.advanceTime(1/60/2);
                //但是建议直接更改时间缩放比例或动作速度比例更直观 armature.animation.timeScale = 0.5 或 anms.setTimeScale(0.5);
                return false;
            },
            this
        );
    }

    private dragonbonesArmature():void
    {
        new modules.DragonBonesArmature(this);
    }

    private dragonbonesFastArmature():void
    {
        new modules.DragonBonesFastArmature(this);
    }

    private dragonbonesCopyAnimations():void
    {
        new modules.DragonBonesCopyAnimations(this);
    }
}


