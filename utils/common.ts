import _, { first, isArray } from "lodash";
import { approver, previewStore, task } from "@/types/next-auth";
import { useEffect, useState } from "react";

import { Session } from 'next-auth';
import Swal from "sweetalert2";
import _apiFn from '@/utils/apiFn';
import axios from "axios";
import convert from "xml-js"

const varString = (varData: string[]) => {
    let newString: string | undefined = "";
    varData.forEach(function (value, i) {
        newString += "['" + value + "']";
    });
    return newString;
};
const callToast = ({ title, type }: any) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: type,
        title: title
    })
}
const getStrName = (fullname: string) => {
    if (fullname === undefined) {
        return ""
    }
    let nameParts = fullname.replace("  ", " ").split(".");

    if (nameParts.length > 1) {
        nameParts = nameParts[1].split(" ")
    } else {
        nameParts = nameParts[0].split(" ")
    }
    let firstName = nameParts[0];
    let lastName = nameParts[1];
    let firstCharacter = firstName[0] + lastName[0];
    return firstCharacter
}

const getByCondition: any = (allTask: any, gatewayArr: any, condition: boolean | undefined, taskData: any) => {

    let gatewayCondition = undefined
    let useData = undefined
    let isDo = true
    // for (let index = 0; index < gatewayArr['bpmn2:outgoing'].length; index++) {
    //     const data = gatewayArr['bpmn2:outgoing'][index];
    //     for (let index = 0; index < allTask.length; index++) {
    //         const d = allTask[index];
    //         if (d._attributes.id === data['_text']) {

    //             gatewayCondition = d['bpmn2:conditionExpression']
    //         }
    //     }
    //     if (gatewayArr['_attributes'].name === "check_resend") {
    //         if (gatewayCondition['_text'].includes("false") && taskData.data.status === 'Rejected') {
    //             // return true
    //             useData = data
    //             break

    //         }
    //         continue
    //     }
    //     if (gatewayCondition['_text'].includes(condition?.toString())) {
    //         useData = data
    //         break
    //         // return true
    //     }


    //     else {
    //         continue
    //     }
    // }
    // console.log("useData",useData);
    // return useData
    // console.log(33, gatewayCondition);
    return gatewayArr['bpmn2:outgoing'].find((data: { [key: string]: any }) => {
        // console.log(2222, data);
        let gatewayCondition = allTask.find((d: any) => {
            // console.log(22, d._attributes.id, data['_text']);

            return d._attributes.id === data['_text']
        })['bpmn2:conditionExpression']
        // console.log(21, gatewayCondition);
        // if (gatewayArr['_attributes'].name === "check_resend") {
        //     // console.log("check_resend", isDo, gatewayCondition['_text']);
        //     if (gatewayCondition['_text'].includes("false") && taskData.data.status === 'Rejected' && isDo === 1) {
        //         // return true
        //     }
        //     return false
        // }
        if (gatewayCondition['_text'].includes(condition?.toString())) {
            return true

        }


        else {
            return false
        }
    })
}

const getAllUserTask = (xml: any) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const userTask = xmlDoc.getElementsByTagName(`bpmn2:userTask`)
    return userTask

}

const checkApp = (taskData: any, userTask: any, allTask: any, nextCondition: boolean | undefined) => {
    const allUserTask = getAllUserTask(taskData.source);
    // console.log(allUserTask);
    let isDo: boolean = true
    let nextNodeId: string | null = null;
    let oldNodeId: string | null = null;
    let task: any = allTask.find((d: any) => d._attributes.id === userTask.elementId)
    let nextApprover: approver[] = []
    do {
        // console.log(oldNodeId,nextNodeId);
        if (task.hasOwnProperty("bpmn2:outgoing")) {
            if (isArray(task['bpmn2:outgoing'])) {
                let nextTaskId = getByCondition(allTask, task, nextCondition, taskData)
                // if (nextTaskId) {
                nextNodeId = nextTaskId['_text'];

                // }
            } else {
                nextNodeId = (task['bpmn2:outgoing']['_text']);
            }
        } else if (task['_attributes'].hasOwnProperty("targetRef")) {
            nextNodeId = (task['_attributes']['targetRef']);
        }
        task = allTask.find((d: any) => d._attributes.id === nextNodeId)
        Array.from(allUserTask).forEach(d => {
            if (d.id === nextNodeId) {
                let splitData = d.getAttribute("name")?.split(':')
                let [fnNam, level, company, department, section, sub_section]: any = splitData
                if (level) {
                    nextApprover.push({ level, company, department, section, sub_section })
                }
            }
        })
        if (oldNodeId === nextNodeId) {
            isDo = false //set for end loop
        }
        oldNodeId = nextNodeId
    } while (isDo);
    // console.log(nextApprover);
    return nextApprover
}


const getNextApprover = (task: { [key: string]: any } | undefined) => {
    if (task === undefined) {
        return;
    }

    const userTask = task.items.find((d: {
        status: string; type: string;
    }) => d.type === "bpmn:UserTask" && d.status === 'wait')
    var result = convert.xml2json(task.source, { compact: true });
    let taskData = JSON.parse(result)
    let allTask = []
    try {
        for (const [key, value] of Object.entries(taskData['bpmn2:definitions']['bpmn2:process'])) {
            if (key === "_attributes") {
                allTask.push({ _attributes: value })
            } else if (isArray(value)) {

                value.forEach(d => allTask.push(d));
            } else {

                allTask.push(value);
            }


        }

        return checkApp(task, userTask, allTask, true)

    } catch (error) {
        console.error(error);

    }

}

const isImageFile = (fileName: string) => {
    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".svg",
        ".bmp",
    ];
    return imageExtensions.some((ext) =>
        fileName.toLowerCase().endsWith(ext)
    );
};
const checkString = (str1: string | undefined, str2: string | undefined, addStr: string) => {
    if (str1 !== undefined) {
        return addStr + str1
    } else if (str2 !== undefined) {
        return addStr + str2
    } else {
        return null
    }

}


const useWidth = () => {
    const [width, setWidth] = useState(0); // default width, detect on server.
    const handleResize = () => setWidth(window.innerWidth);
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);
    return window.innerWidth >= 1024;
};


const checkCanAction = (userSession: Session, task: task) => {
    console.log("in Can action", userSession, task);

    if (userSession !== undefined && task !== undefined) {
        const user = userSession.user
        const currentApprover = task.data.currentApprover
        if (currentApprover == null) {
            return false
        }
        const matchFields = ['company', 'section', 'department', 'level', 'sub_section'];
        //@ts-ignore
        const matches = matchFields.every((field: string) => currentApprover[field] === user[field]) || user.username === currentApprover.empid
        return matches;
    } else {
        return false
    }
}

const getBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const deleteImage = (imageArr: any[], index: number) => {
    imageArr.splice(index, 1);
    return imageArr

}

const removeAttrFromStrapi = (data: []) => {
    cleanStrapiResponse(data)
    // // console.log(data);

    // let newData = [...data]
    // for (let index = 0; index < newData.length; index++) {


    //     do {
    //         if (findNestedArrayWithKey(newData[index], "attributes")) {
    //             // console.log(newData[index]);
    //             if (findNestedArrayWithKey(newData[index].attributes, "data")) {
    //                 // console.log(175);
    //                 for (const [key, value] of Object.entries(newData[index].attributes)) {
    //                     if (typeof value === "object" && "data" in (value as object)) {
    //                         let delData_element = {
    //                             ...newData[index].attributes[key].data
    //                         }
    //                         newData[index].attributes[key] = delData_element
    //                     }
    //                 }
    //             }
    //             let newElement = {
    //                 ...newData[index], ...newData[index].attributes
    //             }
    //             delete newElement.attributes
    //             newData[index] = newElement
    //         }
    //         console.log(newData[index]);

    //     } while (false);
    //     // console.log(newData[index]);
    // }



}

const cleanStrapiResponse = (data: [] | {}) => {
    let newData = []
    if (Array.isArray(data)) {

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            // console.log(element);
            let newObj = { ...element, ...element.attributes }
            delete newObj.attributes
            console.log(newObj);
        }
    }
}

function findNestedArrayWithKey(arr: {}, key: string) {
    if (Array.isArray(arr)) {
        for (let item of arr) {
            if (typeof item === 'object' && item !== null) {
                if (item.hasOwnProperty(key)) {
                    return true;
                }
                if (findNestedArrayWithKey(Object.values(item), key)) {
                    return true;
                }
            }
        }
    }

    if (typeof arr === 'object' && arr !== null) {
        if (arr.hasOwnProperty(key)) {
            return true;
        }
        if (findNestedArrayWithKey(Object.values(arr), key)) {
            return true;
        }
    }

    return false;
}

const onPreviewFile = async (file: string | Blob, type: string, storePreview: previewStore) => {
    if (type === "pdf") {
        if (typeof file === "string") {

            const res = await axios.get(`${process.env.NEXT_PUBLIC_Strapi}${file}`, {
                responseType: "blob",
            });
            const pdfBlob = new Blob([res.data], {
                type: "application/pdf",
            });
            storePreview.onShowBackDrop(pdfBlob, "pdf");
        } else {
            storePreview.onShowBackDrop(file, "pdf");
        }
    }

    if (type === "image") {
        storePreview.onShowBackDrop(
            typeof file === "string" ? `${process.env.NEXT_PUBLIC_Strapi}${file}` : URL.createObjectURL(file),
            "image"
        );
    }
    if (type === "file") {
        if (typeof file === "string") {
            var link = document.createElement("a");
            link.setAttribute("href", `${process.env.NEXT_PUBLIC_Strapi}${file}`);
            link.click();
        }
    }
};

const fn = {
    callToast, onPreviewFile,
    getStrName, varString, getNextApprover, isImageFile, checkString, useWidth, checkCanAction, getBase64, deleteImage, removeAttrFromStrapi
}

export default fn