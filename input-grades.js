document.addEventListener('DOMContentLoaded', () => {
    const modalRecord = document.getElementById('modal-record');
    const data = window.appData;

    document.getElementById('btn-add-record').addEventListener('click', () => {
        modalRecord.style.display = 'block';
    });

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('recordDate').value = today;

    document.getElementById('form-record').addEventListener('submit', e => {
        e.preventDefault();

        const studentId = parseInt(document.getElementById('studentSelect').value);
        const subjectId = parseInt(document.getElementById('subjectSelect').value);
        const date = document.getElementById('recordDate').value;
        const entryInput = (document.getElementById('entryInput').value || '').trim();

        if (!studentId || !subjectId) {
            alert('⚠️ Выберите студента и предмет.');
            return;
        }

        let grades = [];
        let statuses = [];

        if (entryInput) {
            const parts = entryInput.split(',').map(p => p.trim()).filter(p => p);
            for (const part of parts) {
                const num = parseInt(part);
                if (!isNaN(num) && num >= 1 && num <= 5) {
                    grades.push(num);
                } else {
                    statuses.push(part);
                }
            }
        } else {
            statuses.push('Присутствовал');
        }

        data.addRecord(studentId, subjectId, date, grades, statuses);
        renderTable();

        document.getElementById('studentSelect').value = '';
        document.getElementById('subjectSelect').value = '';
        document.getElementById('entryInput').value = '';
        document.getElementById('recordDate').value = today;

        modalRecord.style.display = 'none';
    });

    window.renderTable = function() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        const sorted = [...data.records].sort((a, b) => new Date(b.date) - new Date(a.date));

        sorted.forEach(rec => {
            const student = data.getStudentById(rec.studentId);
            const subject = data.getSubjectById(rec.subjectId);
            if (!student || !subject) return;

            const row = document.createElement('tr');

            row.appendChild(createCell(student.name));
            row.appendChild(createCell(student.group));
            row.appendChild(createCell(subject.name));

            // Оценки
            const gradeCell = document.createElement('td');
            if (rec.grades && rec.grades.length > 0) {
                gradeCell.innerHTML = rec.grades
                    .map(g => `<span class="grade-cell">${g}</span>`)
                    .join(', ');
            } else {
                gradeCell.textContent = '—';
            }
            row.appendChild(gradeCell);

            // Посещаемость
            const attCell = document.createElement('td');
            if (rec.statuses && rec.statuses.length > 0) {
                attCell.textContent = rec.statuses.join(', ');
                const hasPresent = rec.statuses.includes('Присутствовал');
                attCell.className = hasPresent ? 'attendance-yes' : 'attendance-no';
            } else {
                attCell.textContent = '—';
            }
            row.appendChild(attCell);

            row.appendChild(createCell(formatDate(rec.date)));

            tableBody.appendChild(row);
        });
    };

    function createCell(text) {
        const cell = document.createElement('td');
        cell.textContent = text;
        return cell;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return '—';
        return d.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    renderTable();
});