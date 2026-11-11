'use strict';
const STORAGE_KEY = 'student-attendance-v1';
const $ = id => document.getElementById(id);
let state;
try {
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  state = {students: Array.isArray(parsed.students) ? parsed.students : [], records: parsed.records && typeof parsed.records === 'object' ? parsed.records : {}};
} catch { state = {students: [], records: {}}; }
const today = new Date();
$('date').value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; } catch { $('feedback').textContent = 'Could not save. Browser storage may be full or disabled.'; return false; } };
const keyFor = (date, id) => `${date}|${id}`;
const statusFor = (date, id) => state.records[keyFor(date,id)] || '';
function percentFor(id){const marks=Object.entries(state.records).filter(([key,val])=>key.endsWith(`|${id}`)&&(val==='P'||val==='A'));if(!marks.length)return '—';return `${Math.round(100*marks.filter(([,v])=>v==='P').length/marks.length)}%`;}
function render(){
  const date=$('date').value;
  const present=state.students.filter(s=>statusFor(date,s.id)==='P').length;
  const absent=state.students.filter(s=>statusFor(date,s.id)==='A').length;
  $('total').textContent=state.students.length;$('present').textContent=present;$('absent').textContent=absent;$('unmarked').textContent=state.students.length-present-absent;
  const selected=$('class-filter').value;
  const classes=[...new Set(state.students.map(s=>s.section))].sort((a,b)=>a.localeCompare(b));
  $('class-filter').replaceChildren(new Option('All classes',''),...classes.map(s=>new Option(s,s)));
  $('class-filter').value=classes.includes(selected)?selected:'';
  const query=$('search').value.trim().toLowerCase();
  const items=state.students.filter(s=>(!$('class-filter').value||s.section===$('class-filter').value)&&(`${s.roll} ${s.name}`.toLowerCase().includes(query))).sort((a,b)=>a.roll.localeCompare(b.roll,undefined,{numeric:true}));
  const tbody=$('rows');tbody.replaceChildren();
  for (const s of items){
    const tr=document.createElement('tr');
    function cell(value,klass=''){const td=document.createElement('td');td.textContent=value;if(klass)td.className=klass;tr.appendChild(td);return td;}
    cell(s.roll);cell(s.name,'student-name');cell(s.section);
    const att=cell('');const options=document.createElement('div');options.className='attendance-options';
    for(const [status,label,klass] of [['P','Present','present'],['A','Absent','absent']]){
      const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.className=`${klass}${statusFor(date,s.id)===status?' selected':''}`;btn.setAttribute('aria-pressed',String(statusFor(date,s.id)===status));btn.addEventListener('click',()=>{const key=keyFor($('date').value,s.id);if(state.records[key]===status)delete state.records[key];else state.records[key]=status;save();render();});options.appendChild(btn);
    }att.appendChild(options);cell(percentFor(s.id));
    const action=cell('');const del=document.createElement('button');del.type='button';del.className='delete';del.textContent='Delete';del.setAttribute('aria-label',`Delete ${s.name}`);
    del.addEventListener('click',()=>{if(!confirm(`Delete ${s.name} and all their attendance records?`))return;state.students=state.students.filter(v=>v.id!==s.id);for(const key of Object.keys(state.records))if(key.endsWith(`|${s.id}`))delete state.records[key];save();render();});action.appendChild(del);tbody.appendChild(tr);
  }
  $('empty').hidden=items.length>0;
  $('empty').textContent=state.students.length?'No students match your search.':'Add a student to begin.';
}
$('add-form').addEventListener('submit',event=>{event.preventDefault();const roll=$('roll').value.trim();const name=$('name').value.trim();const section=$('section').value.trim();if(!roll||!name||!section)return;if(state.students.some(s=>s.roll.toLowerCase()===roll.toLowerCase())){$('feedback').textContent='A student with that roll number already exists.';return;}const id=globalThis.crypto?.randomUUID?.() || `s${Date.now()}${Math.random().toString(36).slice(2)}`;state.students.push({id,roll,name,section});const saved=save();$('add-form').reset();$('feedback').textContent=saved?'Student added successfully.':'Unable to save student.';render();});
$('mark-all').addEventListener('click',()=>{if(!state.students.length)return;const date=$('date').value;if(!date)return;if(!confirm(`Mark all ${state.students.length} students PRESENT for ${date}? This will overwrite existing marks for this date.`))return;for(const s of state.students)state.records[keyFor(date,s.id)]='P';save();render();});
$('csv').addEventListener('click',()=>{const dates=[...new Set(Object.keys(state.records).map(key=>key.split('|')[0]))].sort();const header=['Roll Number','Student Name','Class / Section',...dates,'Present Days','Marked Days','Attendance Percentage'];const csvEscape=v=>`"${String(v??'').replaceAll('"','""')}"`;const rows=state.students.map(s=>{const marks=dates.map(date=>statusFor(date,s.id));const present=marks.filter(v=>v==='P').length;const count=marks.filter(v=>v==='P'||v==='A').length;return [s.roll,s.name,s.section,...marks.map(v=>v==='P'?'Present':v==='A'?'Absent':''),present,count,count?`${(100*present/count).toFixed(2)}%`:''];});const csv='\uFEFF'+[header,...rows].map(row=>row.map(csvEscape).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='student-attendance-report.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('date').addEventListener('change',render);$('search').addEventListener('input',render);$('class-filter').addEventListener('change',render);render();
