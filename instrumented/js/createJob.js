function cov_1z0dw7nzd0(){var path="C:\\07_P02\\devops-project\\devops-project-jiayu\\public\\js\\createJob.js";var hash="f3b25f784aaa0519d4c075fa727483796abafea4";var global=new Function("return this")();var gcv="__coverage__";var coverageData={path:"C:\\07_P02\\devops-project\\devops-project-jiayu\\public\\js\\createJob.js",statementMap:{"0":{start:{line:2,column:17},end:{line:2,column:60}},"1":{start:{line:3,column:21},end:{line:3,column:65}},"2":{start:{line:4,column:24},end:{line:4,column:71}},"3":{start:{line:5,column:19},end:{line:5,column:61}},"4":{start:{line:6,column:25},end:{line:6,column:73}},"5":{start:{line:7,column:24},end:{line:7,column:71}},"6":{start:{line:10,column:20},end:{line:10,column:86}},"7":{start:{line:13,column:4},end:{line:30,column:5}},"8":{start:{line:14,column:25},end:{line:18,column:10}},"9":{start:{line:19,column:23},end:{line:19,column:44}},"10":{start:{line:20,column:8},end:{line:26,column:9}},"11":{start:{line:21,column:12},end:{line:21,column:45}},"12":{start:{line:22,column:12},end:{line:22,column:23}},"13":{start:{line:23,column:12},end:{line:23,column:33}},"14":{start:{line:25,column:12},end:{line:25,column:58}},"15":{start:{line:28,column:8},end:{line:28,column:50}},"16":{start:{line:29,column:8},end:{line:29,column:57}},"17":{start:{line:34,column:4},end:{line:34,column:53}},"18":{start:{line:35,column:4},end:{line:35,column:54}},"19":{start:{line:36,column:4},end:{line:36,column:57}},"20":{start:{line:37,column:4},end:{line:37,column:52}},"21":{start:{line:38,column:4},end:{line:38,column:58}},"22":{start:{line:39,column:4},end:{line:39,column:57}},"23":{start:{line:40,column:4},end:{line:40,column:38}},"24":{start:{line:43,column:0},end:{line:43,column:25}}},fnMap:{"0":{name:"addJob",decl:{start:{line:1,column:15},end:{line:1,column:21}},loc:{start:{line:1,column:24},end:{line:31,column:1}},line:1},"1":{name:"clearAndCloseModal",decl:{start:{line:33,column:9},end:{line:33,column:27}},loc:{start:{line:33,column:30},end:{line:41,column:1}},line:33}},branchMap:{"0":{loc:{start:{line:20,column:8},end:{line:26,column:9}},type:"if",locations:[{start:{line:20,column:8},end:{line:26,column:9}},{start:{line:24,column:15},end:{line:26,column:9}}],line:20}},s:{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0},f:{"0":0,"1":0},b:{"0":[0,0]},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"f3b25f784aaa0519d4c075fa727483796abafea4"};var coverage=global[gcv]||(global[gcv]={});if(!coverage[path]||coverage[path].hash!==hash){coverage[path]=coverageData;}var actualCoverage=coverage[path];{// @ts-ignore
cov_1z0dw7nzd0=function(){return actualCoverage;};}return actualCoverage;}cov_1z0dw7nzd0();async function addJob(){cov_1z0dw7nzd0().f[0]++;const name=(cov_1z0dw7nzd0().s[0]++,document.getElementById('addJobName').value);const location=(cov_1z0dw7nzd0().s[1]++,document.getElementById('addLocation').value);const description=(cov_1z0dw7nzd0().s[2]++,document.getElementById('addDescription').value);const salary=(cov_1z0dw7nzd0().s[3]++,document.getElementById('addSalary').value);const companyEmail=(cov_1z0dw7nzd0().s[4]++,document.getElementById('addCompanyEmail').value);const companyName=(cov_1z0dw7nzd0().s[5]++,document.getElementById('addCompanyName').value);const jobData=(cov_1z0dw7nzd0().s[6]++,{name,location,description,salary,companyEmail,companyName});cov_1z0dw7nzd0().s[7]++;try{const response=(cov_1z0dw7nzd0().s[8]++,await fetch('/add-job',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(jobData)}));const result=(cov_1z0dw7nzd0().s[9]++,await response.json());cov_1z0dw7nzd0().s[10]++;if(response.ok){cov_1z0dw7nzd0().b[0][0]++;cov_1z0dw7nzd0().s[11]++;alert('Job added successfully!');cov_1z0dw7nzd0().s[12]++;loadJobs();cov_1z0dw7nzd0().s[13]++;clearAndCloseModal();}else{cov_1z0dw7nzd0().b[0][1]++;cov_1z0dw7nzd0().s[14]++;alert('Failed to add job: '+result.message);}}catch(error){cov_1z0dw7nzd0().s[15]++;console.error('Error adding job:',error);cov_1z0dw7nzd0().s[16]++;alert('An error occurred while adding the job.');}}function clearAndCloseModal(){cov_1z0dw7nzd0().f[1]++;cov_1z0dw7nzd0().s[17]++;document.getElementById('addJobName').value='';cov_1z0dw7nzd0().s[18]++;document.getElementById('addLocation').value='';cov_1z0dw7nzd0().s[19]++;document.getElementById('addDescription').value='';cov_1z0dw7nzd0().s[20]++;document.getElementById('addSalary').value='';cov_1z0dw7nzd0().s[21]++;document.getElementById('addCompanyEmail').value='';cov_1z0dw7nzd0().s[22]++;document.getElementById('addCompanyName').value='';cov_1z0dw7nzd0().s[23]++;$('#resourceModal').modal('hide');}cov_1z0dw7nzd0().s[24]++;window.onload=loadJobs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMXowZHc3bnpkMCIsImFjdHVhbENvdmVyYWdlIiwiYWRkSm9iIiwiZiIsIm5hbWUiLCJzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwibG9jYXRpb24iLCJkZXNjcmlwdGlvbiIsInNhbGFyeSIsImNvbXBhbnlFbWFpbCIsImNvbXBhbnlOYW1lIiwiam9iRGF0YSIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXN1bHQiLCJqc29uIiwib2siLCJiIiwiYWxlcnQiLCJsb2FkSm9icyIsImNsZWFyQW5kQ2xvc2VNb2RhbCIsIm1lc3NhZ2UiLCJlcnJvciIsImNvbnNvbGUiLCIkIiwibW9kYWwiLCJ3aW5kb3ciLCJvbmxvYWQiXSwic291cmNlcyI6WyJjcmVhdGVKb2IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gYWRkSm9iKCkge1xyXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRKb2JOYW1lJykudmFsdWU7XHJcbiAgICBjb25zdCBsb2NhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRMb2NhdGlvbicpLnZhbHVlO1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkRGVzY3JpcHRpb24nKS52YWx1ZTtcclxuICAgIGNvbnN0IHNhbGFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRTYWxhcnknKS52YWx1ZTtcclxuICAgIGNvbnN0IGNvbXBhbnlFbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRDb21wYW55RW1haWwnKS52YWx1ZTtcclxuICAgIGNvbnN0IGNvbXBhbnlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZENvbXBhbnlOYW1lJykudmFsdWU7XHJcblxyXG4gXHJcbiAgICBjb25zdCBqb2JEYXRhID0geyBuYW1lLCBsb2NhdGlvbiwgZGVzY3JpcHRpb24sIHNhbGFyeSwgY29tcGFueUVtYWlsLCBjb21wYW55TmFtZSB9O1xyXG4gXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWRkLWpvYicsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShqb2JEYXRhKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgYWxlcnQoJ0pvYiBhZGRlZCBzdWNjZXNzZnVsbHkhJyk7XHJcbiAgICAgICAgICAgIGxvYWRKb2JzKCk7XHJcbiAgICAgICAgICAgIGNsZWFyQW5kQ2xvc2VNb2RhbCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdGYWlsZWQgdG8gYWRkIGpvYjogJyArIHJlc3VsdC5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFkZGluZyBqb2I6JywgZXJyb3IpO1xyXG4gICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgdGhlIGpvYi4nKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJBbmRDbG9zZU1vZGFsKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZEpvYk5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZExvY2F0aW9uJykudmFsdWUgPSAnJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGREZXNjcmlwdGlvbicpLnZhbHVlID0gJyc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkU2FsYXJ5JykudmFsdWUgPSAnJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRDb21wYW55RW1haWwnKS52YWx1ZSA9ICcnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZENvbXBhbnlOYW1lJykudmFsdWUgPSAnJztcclxuICAgICQoJyNyZXNvdXJjZU1vZGFsJykubW9kYWwoJ2hpZGUnKTtcclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9IGxvYWRKb2JzOyJdLCJtYXBwaW5ncyI6Im9vRkFlWTtBQUFBQSxjQUFBLFNBQUFBLENBQUEsU0FBQUMsY0FBQSxXQUFBQSxjQUFBLEVBQUFELGNBQUEsR0FmWixjQUFlLENBQUFFLE1BQU1BLENBQUEsQ0FBRyxDQUFBRixjQUFBLEdBQUFHLENBQUEsTUFDcEIsS0FBTSxDQUFBQyxJQUFJLEVBQUFKLGNBQUEsR0FBQUssQ0FBQSxNQUFHQyxRQUFRLENBQUNDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQ0MsS0FBSyxFQUN4RCxLQUFNLENBQUFDLFFBQVEsRUFBQVQsY0FBQSxHQUFBSyxDQUFBLE1BQUdDLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDQyxLQUFLLEVBQzdELEtBQU0sQ0FBQUUsV0FBVyxFQUFBVixjQUFBLEdBQUFLLENBQUEsTUFBR0MsUUFBUSxDQUFDQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQ0MsS0FBSyxFQUNuRSxLQUFNLENBQUFHLE1BQU0sRUFBQVgsY0FBQSxHQUFBSyxDQUFBLE1BQUdDLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDQyxLQUFLLEVBQ3pELEtBQU0sQ0FBQUksWUFBWSxFQUFBWixjQUFBLEdBQUFLLENBQUEsTUFBR0MsUUFBUSxDQUFDQyxjQUFjLENBQUMsaUJB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