/**
 * Created by YeXin on 2016/2/2.
 */

class DragonBonesDataTree
{
    private static detailed:boolean;

    public constructor()
    {
        throw new Error(this["__class__"] + " 是静态成员集成类，无需实例化");
    }

    /**
     * 读取龙骨数据信息，并以树形结构输出在控制台中
     * @param url   龙骨数据文件(.json)路径
     * @param detailed  是否显示详尽信息
     */
    public static read(url:string, detailed:boolean = false):void
    {
        DragonBonesDataTree.detailed = detailed;
        var urlLoader:egret.URLLoader = new egret.URLLoader();
        urlLoader.addEventListener(egret.Event.COMPLETE, DragonBonesDataTree.onComplete, DragonBonesDataTree);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, DragonBonesDataTree.onError, DragonBonesDataTree);


        urlLoader.load(new egret.URLRequest(url));

    }

    private static onError(event:egret.IOErrorEvent):void
    {
        trace("读取信息错误,请检查url是否正确")
    }

    private static onComplete(event:egret.Event):void
    {
        var urlLoaderData:any = JSON.parse(event.target.data);

        var armatures = urlLoaderData["armature"];
        trace("数据版本:",urlLoaderData["version"]);

        trace("帧频:", urlLoaderData["frameRate"], "fps");
        trace("文件名:", urlLoaderData["name"]);


        for (var index = 0; index < armatures.length; index++)
        {
            if (armatures[index] && armatures[index]["name"])
            {

                trace("骨架数量:", armatures.length + "\n");
            }
        }

        for (index = 0; index < armatures.length; index++)
        {
            trace("    " + urlLoaderData["name"] + " 数据骨架列表节点下标为 [" + index + "] 的骨架名称(urlLoaderData.armature[" + index + "]):", armatures[index]["name"]);//查找 骨架 name 属性的 值  用于生成骨架   var armature: dragonBones.Armature = dragonbonesFactory.buildArmature("骨架名称");


            for (var armatureInfo in armatures)
            {
                var armatureInfo = armatures[armatureInfo];

                for (var nodeInfo in armatureInfo)
                {
                    // trace(nodeInfo);
                    /*
                     bone//骨骼列表
                     skin//皮肤对象列表
                     name//骨架名称
                     slot//关节列表
                     animation//动画列表
                     */


                    if (nodeInfo == "animation")//查找 骨骼动画 name 属性的 值   用于控制动画播放内容  armature.animation.gotoAndPlay("骨骼动画名")
                    {
                        var animation = armatureInfo["animation"];

                        trace("\n        urlLoaderData.armature[" + index + "] 节点的骨骼动画信息列表(长度为 " + animation.length + "):")
                        for (var anmIndex in animation)
                        {
                            if (DragonBonesDataTree.detailed)
                            {
                                if(Number(urlLoaderData["version"]) >= 4)
                                {
                                    trace("                                名称(animation[" + anmIndex + "].name):" + animation[anmIndex]["name"], "  总帧数(animation[" + anmIndex + "].duration):" + animation[anmIndex]["duration"], "  默认循环次数(animation[" + anmIndex + "].playTimes):" + (animation[anmIndex]["playTimes"] == undefined ? 1 : animation[anmIndex]["playTimes"]), "  预计默认循环耗时:" + (animation[anmIndex]["duration"] / urlLoaderData["frameRate"]).toFixed(4));
                                    //默认循环耗时 = 龙骨动画总帧数 / 龙骨动画帧频，只是一个系数，不代表实际的循环时间
                                    //默认循环耗时 可以通过执行 armature.animation.gotoAndPlay("xxx")后的返回对象的totalTime属性获得
                                    //实际循环时间 ≈ ((1/60) * 默认循环耗时) / (advanceTime参数 * 时间缩放比例 * 动作速度比例)
                                }
                                else
                                {
                                    trace("                                名称(animation[" + anmIndex + "].name):" + animation[anmIndex]["name"], "  总帧数(animation[" + anmIndex + "].duration):" + animation[anmIndex]["duration"],"  默认循环次数(animation[" + anmIndex + "].loop):" + (animation[anmIndex]["loop"] == undefined ? 1 : animation[anmIndex]["loop"]), "  预计默认循环耗时:" + (animation[anmIndex]["duration"] / urlLoaderData["frameRate"]).toFixed(4));
                                    //默认循环耗时 = 龙骨动画总帧数 / 龙骨动画帧频，只是一个系数，不代表实际的循环时间
                                    //默认循环耗时 可以通过执行 armature.animation.gotoAndPlay("xxx")后的返回对象的totalTime属性获得
                                    //实际循环时间 ≈ ((1/60) * 默认循环耗时) / (advanceTime参数 * 时间缩放比例 * 动作速度比例)
                                }
                            }
                            else
                            {
                                trace("                                " + animation[anmIndex]["name"]);
                            }
                        }
                    }



                    if (nodeInfo == "bone")
                    {
                        var bone = armatureInfo["bone"];
                        var slotArray;
                        if (armatureInfo["slot"])
                        {
                            slotArray = armatureInfo["slot"].concat();
                        }

                        if(Number(urlLoaderData["version"]) < 4)//4.0以下版本的数据插槽的遍历方式
                        {
                            if(armatures[index].skin && armatures[index].skin.length)
                            {
                                slotArray = armatures[index].skin[0].slot.concat();

                                if(armatures[index].skin.length > 1)
                                {
                                    for(var skinIndex = 1;skinIndex < armatures[index].skin.length;skinIndex++)
                                    {
                                        if(armatures[index].skin[skinIndex].slot)
                                        {
                                            slotArray.concat(armatures[index].skin[skinIndex].slot);
                                        }
                                    }
                                }
                            }

                        }

                        trace("\n        urlLoaderData.armature[" + index + "] 节点的骨骼部件名称列表(长度为 " + bone.length + "):")
                        for (var boneIndex in bone)
                        {
                            var slotName = "undefined";

                            for (var slotIndex in slotArray)
                            {
                                var slot = slotArray[slotIndex];
                                if(Number(urlLoaderData["version"]) >= 4)
                                {
                                    if (slot.parent && slot.parent == bone[boneIndex]["name"])
                                    {
                                        slotName = slot.name;

                                        break;
                                    }
                                }
                                else
                                {
                                    if(slot.name == bone[boneIndex]["name"])
                                    {
                                        slotName = slot.name;
                                        break;
                                    }
                                }
                            }



                            if (DragonBonesDataTree.detailed)
                            {
                                if (slotName == "undefined")
                                {
                                    trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  ---未绑定插槽---");
                                }
                                else
                                {
                                    if(Number(urlLoaderData["version"]) >= 4)
                                    {
                                        trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  绑定插槽名称(slot[" + slotIndex + "].name):" + slotName);
                                    }
                                    else
                                    {
                                        trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  绑定插槽名称(skin[0].slot[" + slotIndex +"].name):" + slotName);
                                    }
                                }
                            }
                            else
                            {
                                trace("                                " + bone[boneIndex]["name"]);
                            }
                        }
                        /*
                         //查找某个骨骼部件的名称，用于单独控制某一部件的活动 例如控制头部
                         var head = this.armature.getBone("head");
                         head.offset.rotation = 100;
                         //要注意的是自head以下的子骨骼部件也会跟随改变，除非预先更改骨骼的从属关系

                         */
                        /*
                         //通过插槽实现换装
                         var image = this.factory.getTextureDisplay(textureName);//创建新的图片用于换装
                         var slot: dragonBones.Slot = this.armature.getSlot("clothes");//找到包含要换装的图片的插槽
                         slot.setDisplay(image);//替换插槽的显示对象
                         */
                    }
                }
            }
        }
    }
}
