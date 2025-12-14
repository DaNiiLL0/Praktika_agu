window.appData = {
    students: [],
    subjects: [],
    records: [], // { id, studentId, subjectId, date, grades: [], statuses: [] }

    currentStudentId: 1,
    currentSubjectId: 1,
    currentRecordId: 1,

    load() {
        const s = localStorage.getItem('students');
        const sb = localStorage.getItem('subjects');
        const r = localStorage.getItem('records');
        const sid = localStorage.getItem('currentStudentId');
        const sbid = localStorage.getItem('currentSubjectId');
        const rid = localStorage.getItem('currentRecordId');

        this.students = s ? JSON.parse(s) : [];
        this.subjects = sb ? JSON.parse(sb) : [];
        this.records = r ? JSON.parse(r) : [];

        this.currentStudentId = sid ? parseInt(sid) : 1;
        this.currentSubjectId = sbid ? parseInt(sbid) : 1;
        this.currentRecordId = rid ? parseInt(rid) : 1;
    },

    save() {
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('subjects', JSON.stringify(this.subjects));
        localStorage.setItem('records', JSON.stringify(this.records));
        localStorage.setItem('currentStudentId', this.currentStudentId.toString());
        localStorage.setItem('currentSubjectId', this.currentSubjectId.toString());
        localStorage.setItem('currentRecordId', this.currentRecordId.toString());
    },

    getStudentById(id) {
        return this.students.find(s => s.id === id);
    },
    getSubjectById(id) {
        return this.subjects.find(s => s.id === id);
    },
    addStudent(name, group) {
        this.students.push({
            id: this.currentStudentId++,
            name: name.trim(),
            group: group.trim()
        });
        this.save();
    },
    addSubject(name) {
        this.subjects.push({
            id: this.currentSubjectId++,
            name: name.trim()
        });
        this.save();
    },
    addRecord(studentId, subjectId, date, grades = [], statuses = []) {
        if (grades.length === 0 && statuses.length === 0) {
            statuses = ['Присутствовал'];
        }
        this.records.push({
            id: this.currentRecordId++,
            studentId,
            subjectId,
            date,
            grades,
            statuses
        });
        this.save();
    },
    getGroups() {
        return [...new Set(this.students.map(s => s.group))];
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.appData.load();
});