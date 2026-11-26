(function(){
var A={
"القاهرة":[["وسط البلد","Downtown"],["الزمالك","Zamalek"],["جاردن سيتي","Garden City"],["عابدين","Abdeen"],["الأزبكية","Azbakeya"],["الموسكي","Mosky"],["باب الشعرية","Bab El Sheria"],["الجمالية","Gamaliya"],["الدرب الأحمر","Darb El Ahmar"],["الخليفة","Khalifa"],["السيدة زينب","Sayeda Zeinab"],["مصر القديمة","Old Cairo"],["المعادي","Maadi"],["دار السلام","Dar El Salam"],["البساتين","Basatin"],["طرة","Tura"],["حلوان","Helwan"],["المعصرة","Maasara"],["التبين","Tebbin"],["15 مايو","15th of May City"],["القطامية","Katameya"],["المقطم","Mokattam"],["منشية ناصر","Manshiyat Nasser"],["الزيتون","Zeitoun"],["المطرية","Matareya"],["عين شمس","Ain Shams"],["النزهة","Nozha"],["مصر الجديدة","Heliopolis (Masr El Gedida)"],["مدينة نصر","Nasr City"],["الشروق","El Shorouk"],["بدر","Badr City"],["التجمع الأول","First Settlement"],["التجمع الثالث","Third Settlement"],["التجمع الخامس","Fifth Settlement"],["الرحاب","Rehab City"],["مدينتي","Madinaty"],["العاصمة الإدارية الجديدة","New Administrative Capital"],["شبرا","Shubra"],["روض الفرج","Rod El Farag"],["الساحل","El Sahel"],["الوايلي","Weili"],["الظاهر","Zahir"],["الأميرية","Amiriya"],["حدائق القبة","Hadayek El Kobba"],["الزاوية الحمراء","Zawya El Hamra"],["السلام أول","El Salam 1"],["السلام ثان","El Salam 2"],["المرج","Marg"],["عزبة النخل","Ezbet El Nakhl"],["النهضة","El Nahda"],["الأسمرات","El Asmarat"],["أخرى","Other"]],
"الجيزة":[["الدقي","Dokki"],["المهندسين","Mohandessin"],["العجوزة","Agouza"],["الجيزة (وسط)","Giza (Center)"],["الهرم","Haram"],["فيصل","Faisal"],["العمرانية","Omraniya"],["بولاق الدكرور","Bulaq El Dakrour"],["إمبابة","Imbaba"],["الوراق","Warraq"],["المنيب","Moneeb"],["الكيت كات","Kit Kat"],["الطالبية","Talbiya"],["ناهيا","Nahya"],["ميت عقبة","Mit Okba"],["أوسيم","Awsim"],["كرداسة","Kerdasa"],["أبو النمرس","Abu El Numrus"],["الشيخ زايد","Sheikh Zayed"],["6 أكتوبر","6th of October"],["حدائق أكتوبر","October Gardens"],["حدائق الأهرام","Hadayek El Ahram"],["القرية الذكية","Smart Village"],["الحوامدية","Hawamdeya"],["البدرشين","Badrashin"],["الصف","El Saff"],["أطفيح","Atfih"],["العياط","El Ayat"],["منشأة القناطر","Manshaat El Qanater"],["كفر طهرمس","Kafr Tahrmos"],["ساقية مكي","Sakiet Makki"],["الواحات البحرية","Bahariya Oasis"],["أخرى","Other"]],
"الإسكندرية":[["المنتزه","Montaza"],["سيدي بشر","Sidi Bishr"],["العصافرة","Asafra"],["ميامي","Miami"],["المندرة","Mandara"],["المعمورة","Maamoura"],["أبو قير","Abu Qir"],["سموحة","Smouha"],["سيدي جابر","Sidi Gaber"],["كليوباترا","Cleopatra"],["ستانلي","Stanley"],["سان ستيفانو","San Stefano"],["جليم","Glim"],["زيزينيا","Zezenia"],["لوران","Laurent"],["فلمنج","Fleming"],["السيوف","Seyouf"],["سبورتنج","Sporting"],["الرمل (محطة الرمل)","Raml Station"],["باكوس","Bacos"],["كامب شيزار","Camp Caesar"],["الشاطبي","Shatby"],["الأزاريطة","Azarita"],["محرم بك","Moharam Bek"],["كرموز","Karmouz"],["اللبان","Labban"],["الجمرك","Gomrok"],["المنشية","Manshiya"],["بحري","Bahary"],["الأنفوشي","Anfoushi"],["رأس التين","Ras El Tin"],["القباري","Qabbary"],["الورديان","Wardian"],["الدخيلة","Dekheila"],["العجمي","Agamy"],["الهانوفيل","Hanoville"],["البيطاش","Bitash"],["أبيس","Abis"],["المكس","Max"],["غيط العنب","Ghait El Enab"],["كفر عبده","Kafr Abdu"],["العامرية","Amreya"],["برج العرب","Borg El Arab"],["برج العرب الجديدة","New Borg El Arab"],["سيدي كرير","Sidi Kerir"],["أخرى","Other"]]
};
var gov=document.getElementById('gov'),area=document.getElementById('area');if(!gov||!area)return;
var pairs=[["الرئيسية","Home"]];
Object.keys(A).forEach(function(g){A[g].forEach(function(p){pairs.push(p)})});
if(window.SITT_I18N_ADD)window.SITT_I18N_ADD(pairs);else (window.SITT_I18N_Q=window.SITT_I18N_Q||[]).push(pairs);
/* keep only the three served governorates */
[].slice.call(gov.options).forEach(function(o){if(o.value&&!A[o.value.trim()]&&o.textContent.trim()!==''&&!A[o.textContent.trim()])o.remove()});
[].slice.call(gov.options).forEach(function(o){if(!o.hasAttribute('value'))o.setAttribute('value',o.textContent.trim())});
var ph=area.options[0];
function fill(){
  var g=gov.value;
  while(area.options.length>1)area.remove(1);
  (A[g]||[]).forEach(function(p){var o=document.createElement('option');o.value=p[0];o.textContent=p[0];area.appendChild(o)});
  area.selectedIndex=0;
}
gov.addEventListener('change',fill);fill();
})();
