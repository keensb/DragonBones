/**
 * Created by YeXin on 2016/4/4.
 */
var DragonBonesDataTree = (function () {
    function DragonBonesDataTree() {
        throw new Error(this["__class__"] + " 是静态成员集成类，无需实例化");
    }
    var d = __define,c=DragonBonesDataTree,p=c.prototype;
    /**
     * 读取龙骨数据信息，并以树形结构输出在控制台中
     * @param url   龙骨数据文件(.json)路径
     * @param detailed  是否显示详尽信息
     */
    DragonBonesDataTree.read = function (url, detailed) {
        if (detailed === void 0) { detailed = false; }
        DragonBonesDataTree.detailed = detailed;
        var urlLoader = new egret.URLLoader();
        urlLoader.addEventListener(egret.Event.COMPLETE, DragonBonesDataTree.onComplete, DragonBonesDataTree);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, DragonBonesDataTree.onError, DragonBonesDataTree);
        urlLoader.load(new egret.URLRequest(url));
    };
    DragonBonesDataTree.onError = function (event) {
        trace("读取信息错误,请检查url是否正确");
    };
    DragonBonesDataTree.onComplete = function (event) {
        var urlLoaderData = JSON.parse(event.target.data);
        var armatures = urlLoaderData["armature"];
        trace("数据版本:", urlLoaderData["version"]);
        trace("帧频:", urlLoaderData["frameRate"], "fps");
        trace("文件名:", urlLoaderData["name"]);
        var armatureCounts = 0;
        for (var armaturesIndex = 0; armaturesIndex < armatures.length; armaturesIndex++) {
            if (armatures[armaturesIndex] && armatures[armaturesIndex]["name"]) {
                armatureCounts++;
            }
        }
        trace("骨架数量:", armatureCounts);
        if (DragonBonesDataTree.detailed) {
            trace("骨架名称:");
            for (var index = 0; index < armatures.length; index++) {
                if (armatures[index] && armatures[index]["name"]) {
                    trace("    [" + index + "] " + armatures[index]["name"]);
                }
            }
        }
        for (index = 0; index < armatures.length; index++) {
            trace("\n\n    " + urlLoaderData["name"] + " 数据骨架列表节点下标为 [" + index + "] 的骨架名称(urlLoaderData.armature[" + index + "].name):", armatures[index]["name"]); //查找 骨架 name 属性的 值  用于生成骨架   var armature: dragonBones.Armature = dragonbonesFactory.buildArmature("骨架名称");
            if (DragonBonesDataTree.detailed) {
                trace("\n        urlLoaderData.armature[" + index + "] 拥有以下子节点对象：");
            }
            //for (var armatureInfo in armatures)
            var armatureInfo = armatures[index];
            var nodeInfo;
            if (DragonBonesDataTree.detailed) {
                for (nodeInfo in armatureInfo) {
                    trace("                                " + nodeInfo);
                }
            }
            /*
             bone//骨骼列表
             skin//皮肤对象列表
             name//骨架名称
             slot//关节列表
             animation//动画列表
             */
            nodeInfo = "animation"; ////查找 骨骼动画 name 属性的 值   用于控制动画播放内容  armature.animation.gotoAndPlay("骨骼动画名")
            //if (nodeInfo == "animation")//查找 骨骼动画 name 属性的 值   用于控制动画播放内容  armature.animation.gotoAndPlay("骨骼动画名")
            //{
            var animation = armatureInfo["animation"];
            var infoText = "";
            trace("\n        urlLoaderData.armature[" + index + "] 节点的骨骼动画信息列表(长度为 " + animation.length + "):");
            for (var anmIndex in animation) {
                if (DragonBonesDataTree.detailed) {
                    if (Number(urlLoaderData["version"]) >= 4) {
                        trace("                                动画名称(animation[" + anmIndex + "].name):" + animation[anmIndex]["name"], "  总帧数(animation[" + anmIndex + "].duration):" + (animation[anmIndex]["duration"] + 1), "  默认循环次数(animation[" + anmIndex + "].playTimes):" + (animation[anmIndex]["playTimes"] == undefined ? 1 : animation[anmIndex]["playTimes"]), "  预计默认循环耗时:" + (animation[anmIndex]["duration"] / urlLoaderData["frameRate"]).toFixed(4));
                    }
                    else {
                        trace("                                动画名称(animation[" + anmIndex + "].name):" + animation[anmIndex]["name"], "  总帧数(animation[" + anmIndex + "].duration):" + (animation[anmIndex]["duration"] + 1), "  默认循环次数(animation[" + anmIndex + "].loop):" + (animation[anmIndex]["loop"] == undefined ? 1 : animation[anmIndex]["loop"]), "  预计默认循环耗时:" + (animation[anmIndex]["duration"] / urlLoaderData["frameRate"]).toFixed(4));
                    }
                }
                else {
                    infoText += ("\n                                " + animation[anmIndex]["name"]);
                }
            }
            //}
            if (!DragonBonesDataTree.detailed) {
                trace(infoText);
            }
            infoText = "";
            nodeInfo = "bone";
            //if (nodeInfo == "bone")
            //{
            var bone = armatureInfo["bone"];
            var slotArray;
            if (armatureInfo["slot"]) {
                slotArray = armatureInfo["slot"].concat();
            }
            if (Number(urlLoaderData["version"]) < 4) {
                if (armatures[index].skin && armatures[index].skin.length) {
                    slotArray = armatures[index].skin[0].slot.concat();
                    if (armatures[index].skin.length > 1) {
                        for (var skinIndex = 1; skinIndex < armatures[index].skin.length; skinIndex++) {
                            if (armatures[index].skin[skinIndex].slot) {
                                slotArray.concat(armatures[index].skin[skinIndex].slot);
                            }
                        }
                    }
                }
            }
            trace("\n        urlLoaderData.armature[" + index + "] 节点的骨骼部件名称列表(长度为 " + bone.length + "):");
            for (var boneIndex in bone) {
                var slotName = "undefined";
                for (var slotIndex in slotArray) {
                    var slot = slotArray[slotIndex];
                    if (Number(urlLoaderData["version"]) >= 4) {
                        if (slot.parent && slot.parent == bone[boneIndex]["name"]) {
                            slotName = slot.name;
                            break;
                        }
                    }
                    else {
                        if (slot.name == bone[boneIndex]["name"]) {
                            slotName = slot.name;
                            break;
                        }
                    }
                }
                if (DragonBonesDataTree.detailed) {
                    if (slotName == "undefined") {
                        trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  ---未绑定插槽---");
                    }
                    else {
                        if (Number(urlLoaderData["version"]) >= 4) {
                            trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  绑定插槽名称(slot[" + slotIndex + "].name):" + slotName);
                        }
                        else {
                            trace("                                骨骼名称(bone[" + boneIndex + "].name):" + bone[boneIndex]["name"], "  绑定插槽名称(skin[0].slot[" + slotIndex + "].name):" + slotName);
                        }
                    }
                }
                else {
                    infoText += ("\n                                " + bone[boneIndex]["name"]);
                }
            }
            if (!DragonBonesDataTree.detailed) {
                trace(infoText);
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
            //}
            if (DragonBonesDataTree.detailed) {
                var skin = armatureInfo["skin"];
                trace("\n        urlLoaderData.armature[" + index + "] 节点的皮肤信息列表(长度为 " + skin.length + "):");
                for (var skinIndex = 0; skinIndex < skin.length; skinIndex++) {
                    var slotArray = skin[skinIndex].slot;
                    trace("\n            下标为 [" + skinIndex + "] 的皮肤名称(skin[" + skinIndex + "].name):" + skin[skinIndex]["name"] + " , 插槽信息列表(长度为" + slotArray.length + "): ");
                    for (var slotIndex in slotArray) {
                        var imageInfo = "";
                        var display = slotArray[slotIndex].display;
                        for (var image in display) {
                            imageInfo += ("   " + display[image].name);
                        }
                        var count = "";
                        if (display.length > 1) {
                            count = "(" + display.length + "个)";
                        }
                        trace("                                插槽名称 (skin[" + skinIndex + "].slot[" + slotIndex + "].name):" + slotArray[slotIndex].name + "    绑定的图像为" + count + ":  " + imageInfo);
                    }
                }
            }
            trace("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            trace("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        }
    };
    return DragonBonesDataTree;
}());
egret.registerClass(DragonBonesDataTree,'DragonBonesDataTree');
