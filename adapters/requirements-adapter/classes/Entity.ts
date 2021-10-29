import axios from 'axios';
import IRequirement from '../interfaces/IRequirementEntity';
import type {Requirement} from '../types/Requirement';

class Entity implements IRequirement {

    [key: string]: any,
    number: any;
    classId: number;
    projectId: number;
    basis: string;
    allocation: string;
    verification_criteria: string;
    verification_method: string;

    constructor(requirement: Requirement, number: number, classId: number = 22, projectId: number = 90) {
        this.number = number;
        this.classId = classId;
        this.projectId = projectId;

        for (let key in requirement) {
            this[key] = requirement[key]
        }
    }

    async allocateId() {
        await axios.get(`${process.env.INNOSLATE_HOST}/o/nric/allocate_ids`, {
            params: {
                type: 'entity',
                count: 1
            },
            headers: {
                Authorization: `basic ${process.env.INNOSLATE_KEY}`
            }
        }).then((response: any) => {
            this.id = response.data[0].id;
            this.globalId = response.data[0].globalId;
        });
    }

    async post() {
        await axios.post(`${process.env.INNOSLATE_HOST}/o/nric/entities`, [this], {
            headers: {
                Authorization: `basic ${process.env.INNOSLATE_KEY}`
            }
        }).then((response: any) => {
            console.log(response);
        })
    }

}

export {Entity};