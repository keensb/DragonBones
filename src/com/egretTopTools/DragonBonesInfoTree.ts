/**
 * Created by YeXin on 2016/2/2.
 */

class DragonBonesInfoTree
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
        DragonBonesInfoTree.detailed = detailed;
        var urlLoader:egret.URLLoader = new egret.URLLoader();
        urlLoader.addEventListener(egret.Event.COMPLETE, DragonBonesInfoTree.onComplete, DragonBonesInfoTree);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, DragonBonesInfoTree.onError, DragonBonesInfoTree);


        urlLoader.load(new egret.URLRequest(url));

    }

    private static onError(event:egret.IOErrorEvent):void
    {
        trace("读取信息错误,请检查url是否正确")
    }

    private static onComplete(event:egret.Event):void
    {
        var urlLoaderData:any = JSON.parse(event.target.data);

        trace("帧频:", urlLoaderData["frameRate"], "fps");
        trace("文件名:", urlLoaderData["name"]);

        var armatures = urlLoaderData["armature"];

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
                            if (DragonBonesInfoTree.detailed)
                            {
                                trace("                                名称(animation[" + anmIndex + "].name):" + animation[anmIndex]["name"], "  总帧数(animation[" + anmIndex + "].duration):" + animation[anmIndex]["duration"], "  默认循环次数(animation[" + anmIndex + "].playTimes):" + (animation[anmIndex]["playTimes"] == undefined ? 1 : animation[anmIndex]["playTimes"]), "  预计耗时:" + (animation[anmIndex]["duration"] / urlLoaderData["frameRate"]).toFixed(4))
                            }
                            else
                            {
                                trace("                                " + animation[anmIndex]["name"]);
                            }
                        }
                    }

                    var slotArray = armatureInfo["slot"].concat();

                    if (nodeInfo == "bone")
                    {
                        var bone = armatureInfo["bone"];

                        trace("\n        urlLoaderData.armature[" + index + "] 节点的骨骼部件名称列表(长度为 " + bone.length + "):")
                        for (var boneIndex in bone)
                        {
                            var slotName = "undefined";
                            for (var slotIndex in slotArray)
                            {
                                var slot = slotArray[slotIndex];
                                if (slot.parent && slot.parent == bone[boneIndex]["name"])
                                {
                                    slotName = slot.name;
                                    slotArray.splice(slotIndex, 1);
                                    slotIndex--;
                                    break;
                                }
                            }
                            if (DragonBonesInfoTree.detailed)
                            {
                                if (slotName == "undefined")
                                {
                                    trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  ---未绑定插槽---");
                                }
                                else
                                {
                                    trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  绑定插槽名称(slot[" + armatureInfo["slot"].indexOf(slot) + "].name):" + slotName);
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
