export default interface IRequirement {
    [key: string]: any,
    number: number,
    classId: number,
    projectId: number,
    // basis: string,
    // allocation: string,
    // verification_criteria: string,
    // verification_method: string


    allocateId(): any;
}
