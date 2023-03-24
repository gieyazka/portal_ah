import _, { first, isArray } from "lodash";

import { approver } from "@/types/next-auth";
import convert from "xml-js"

const varString = (varData: string[]) => {
    let newString: string | undefined = "";
    varData.forEach(function (value, i) {
        newString += "['" + value + "']";
    });
    return newString;
};


const getByCondition: any = (allTask: any, gatewayArr: {}[], condition: boolean | undefined) => {
    return gatewayArr.find((data: { [key: string]: any }) => {
        let gatewayCondition = allTask.find((d: any) => d._attributes.id === data['_text'])['bpmn2:conditionExpression']
        if (gatewayCondition['_text'].includes(condition?.toString())) {
            return true

        } else {
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

const checkApp = (xml: any, userTask: any, allTask: any, nextCondition: boolean | undefined) => {
    const allUserTask = getAllUserTask(xml);
    let isDo: boolean = true
    let i = 0;
    let nextNodeId: string | null = null;
    let oldNodeId: string | null = null;
    let task: any = allTask.find((d: any) => d._attributes.id === userTask.elementId)
    let nextApprover: approver[] = []
    do {
        i = i + 1;
        if (task.hasOwnProperty("bpmn2:outgoing")) {
            if (isArray(task['bpmn2:outgoing'])) {
                let nextTaskId = getByCondition(allTask, task['bpmn2:outgoing'], nextCondition)
                nextNodeId = nextTaskId['_text'];
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


        return checkApp(task.source, userTask, allTask, true)

    } catch (error) {
        console.error(error);

    }

}


const checkString = (str1: string | undefined, str2: string | undefined,addStr : string) => {
    if (str1 !== undefined) {
        return addStr + str1
    } else if (str2 !== undefined) {
        return addStr + str2
    } else {
        return null
    }

}



const fn = {
    varString, getNextApprover, checkString
}

export default fn