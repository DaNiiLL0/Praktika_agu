document.addEventListener('DOMContentLoaded', () => {
    const modalAnalytics = document.getElementById('modal-analytics');
    const data = window.appData;

    document.getElementById('btn-show-analytics').addEventListener('click', () => {
        modalAnalytics.style.display = 'block';
        updateGroupSelect();
    });

    document.querySelector('#modal-analytics .close').addEventListener('click', () => {
        modalAnalytics.style.display = 'none';
    });
    window.addEventListener('click', e => {
        if (e.target === modalAnalytics) {
            modalAnalytics.style.display = 'none';
        }
    });

    document.getElementById('btn-run-analytics').addEventListener('click', () => {
        const group = document.getElementById('groupSelect').value;
        const stats = calculateAnalytics(group);
        displayAnalytics(stats);
    });

    function calculateAnalytics(group = '') {
        const targetStudents = group
            ? data.students.filter(s => s.group === group)
            : data.students;
        const studentIds = targetStudents.map(s => s.id);
        const filtered = data.records.filter(r => studentIds.includes(r.studentId));

        const grades = filtered
            .flatMap(r => r.grades || [])
            .filter(g => typeof g === 'number' && g >= 1 && g <= 5);
        const avg = grades.length
            ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
            : 'Нет данных';

        const attendedLessons = filtered.filter(r => {
            const statuses = r.statuses || [];
            return statuses.length === 0 || statuses.includes('Присутствовал')
        }).length;
        const totalLessons = filtered.length;
        const att = totalLessons
            ? ((attendedLessons / totalLessons) * 100).toFixed(1) + '%'
            : 'Нет данных';

        const uniqueSubjects = new Set(filtered.map(r => r.subjectId)).size;

        return {
            averageGrade: avg,
            attendanceRate: att,
            studentCount: targetStudents.length,
            subjectCount: uniqueSubjects,
            totalRecords: totalLessons,
            totalGrades: grades.length
        };
    }

    function displayAnalytics(stats) {
        document.getElementById('analyticsContainer').classList.remove('hidden');
        document.getElementById('averageGrade').textContent = stats.averageGrade;
        document.getElementById('attendanceRate').textContent = stats.attendanceRate;
        document.getElementById('studentCount').textContent = stats.studentCount;
        document.getElementById('subjectCount').textContent = stats.subjectCount;
        document.getElementById('totalRecords').textContent = stats.totalRecords;
        document.getElementById('totalGrades').textContent = stats.totalGrades;
    }
});