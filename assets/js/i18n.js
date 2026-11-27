(function(){
'use strict';
var d=document,H=d.documentElement,KEY='sitt-lang';
var P=[
["الرئيسية","Home"],["/ الشيميزات","/ Shirts"],["/ المفضلة","/ Wishlist"],["/ تسوقي الكل","/ Shop all"],["/ حقيبة التسوق","/ Shopping bag"],["/ شميز اللفّة الذهبية","/ Golden Wrap Shirt"],["/ تسوقي الكل","/ Shop all"],
["تسوقي الكل","Shop all"],["الشيميزات","Shirts"],["التيشيرتات","Tees"],["حكايتنا","Our story"],["تتبع طلبك","Track your order"],["· تتبع طلبك","· Track your order"],["تتبع طلبي","Track my order"],["تتبعي طلبك","Track your order"],
["من جذور ملكية... لحكايتك إنتِ","From royal roots... for your own story"],["اكتشفي ست","Discover SITT"],["نقدر نساعدك؟","Need help?"],["خليكي قريبة","Stay close"],
["دليل المقاسات","Size guide"],["الشحن والاستبدال","Shipping & exchange"],["تواصلي معانا","Contact us"],["ست، ملكة بطبعك.","SITT, a queen by nature."],["من إلهام مصر، لكل ست.","Inspired by Egypt, for every woman."],
["جميع الحقوق محفوظة ©","All rights reserved ©"],["سياسة الخصوصية","Privacy policy"],["الشروط والأحكام","Terms & conditions"],["ســت","SITT"],["ست","SITT"],["ست SITT","SITT"],
["الحقيبة","Bag"],["بحث","Search"],["شعار ست","SITT logo"],["رموز ست","SITT symbols"],["لون الموقع","Site color"],
["أسود","Black"],["برجندي","Burgundy"],["كريمي","Cream"],["أضيفي للمفضلة","Add to wishlist"],["المفضلة","Wishlist"],["أقل","Less"],["أكتر","More"],
["اسم العائلة","Last name"],["الاسم الأول","First name"],["اسمك الأول","Your first name"],["الدور / رقم الشقة","Floor / apartment no."],["بريدك الإلكتروني","Your email"],["البريد الإلكتروني","Email"],
["حابة تقولي لنا حاجة؟","Anything you want to tell us?"],["علامة قريبة من العنوان","A landmark near the address"],["عنوان التوصيل بالتفصيل","Full delivery address"],
["بلوزة العود الذهبي","Golden Oud Blouse"],["بلوزة جرس اللوتس","Lotus Bell Blouse"],["شميز اللفّة الذهبية","Golden Wrap Shirt"],["شميز اللفّة الذهبية أسود","Golden Wrap Shirt, Black"],["شميز اللفّة الذهبية برجندي","Golden Wrap Shirt, Burgundy"],["شميز اللفّة الذهبية كريمي","Golden Wrap Shirt, Cream"],
["جديد","New"],["الكل","All"],["الترتيب: الأحدث","Sort: Newest"],["التيشيرتات... قريبًا","Tees... coming soon"],["بلغوني","Notify me"],
["الفصل الأول","Chapter One"],["الفصل الأول من حكايتنا","The first chapter of our story"],["الفصل الأول — قطع تحكيها، وحكاية تكمّلها.","Chapter One: pieces that tell a story, and a story you complete."],
["اكتشفي المجموعة","Explore the collection"],["اعرفي حكايتنا","Know our story"],["شوفي القطع","See the pieces"],["ادخلي الفصل الأول","Enter Chapter One"],["أضيفي للحقيبة","Add to bag"],["اضيفيها في المفضلة","Add it to wishlist"],
["كمّلي تسوق","Keep shopping"],["كمّلي تسوق ←","Keep shopping →"],["كمّلي لإتمام الطلب","Continue to checkout"],["تعديل الحقيبة ←","Edit bag →"],["إرسال الطلب للمراجعة","Send order for review"],
["حقيبتك... وأول الحكاية.","Your bag... and the start of the story."],["حقيبتك — ست SITT","Your bag — SITT"],["حقيبتك فاضية... لسه.","Your bag is empty... for now."],["كل قطعة هنا بداية حكاية جديدة. اختاري أول قطعة في حكايتك.","Every piece here is the start of a new story. Choose the first piece of yours."],["تسوقي المجموعة","Shop the collection"],
["كل قطعة هنا... بداية حكاية جديدة.","Every piece here... starts a new story."],["اختاري أول قطعة في حكايتك.","Choose the first piece of your story."],
["الإجمالي","Total"],["الإجمالي (قبل الشحن)","Total (before shipping)"],["مجموع القطع","Items subtotal"],["إجمالي القطع — قبل إضافة الشحن","Items total, before shipping"],["الشحن","Shipping"],["حسب العنوان","By address"],["الشحن حسب عنوانك","Shipping depends on your address"],
["تكلفة الشحن والإجمالي النهائي بيتأكدوا معاكي قبل تجهيز الطلب.","Shipping cost and the final total are confirmed with you before we prepare the order."],
["ملخص طلبك","Your order summary"],["الدفع عند الاستلام","Cash on delivery"],["بطاقة / محفظة إلكترونية","Card / e-wallet"],["قريبًا","Soon"],["إتمام الطلب — ست SITT","Checkout — SITT"],
["١. بيانات التواصل","1. Contact details"],["٢. عنوان التوصيل","2. Delivery address"],["٣. طريقة الدفع المفضّلة","3. Preferred payment method"],["ملاحظة مع الطلب — اختياري","Order note, optional"],["— اختياري","— optional"],
["المحافظة","Governorate"],["المدينة / المنطقة","City / area"],["الشارع ورقم العمارة","Street and building no."],["الدور والشقة","Floor and apartment"],["رقم الموبايل","Mobile number"],["رقم الطلب","Order number"],
["اختاري المحافظة ↓","Choose governorate ↓"],["اختاري منطقتك ↓","Choose your area ↓"],["أخرى","Other"],["اكتبي منطقتك","Type your area"],["اسم المنطقة / المدينة","Area / city name"],["أخرى:","Other:"],
["القاهرة","Cairo"],["الجيزة","Giza"],["الإسكندرية","Alexandria"],["الدقهلية","Dakahlia"],["الشرقية","Sharqia"],["أسيوط","Assiut"],["المعادي","Maadi"],["التجمع","New Cairo (Tagamoa)"],["مدينة نصر","Nasr City"],["وسط البلد","Downtown"],
["تأكيد وسيلة الدفع بيكون مع فريقنا قبل تجهيز الطلب.","Our team confirms the payment method before preparing the order."],["هنتأكد معاكي لتكلفة ومدة التوصيل قبل ما نجهّز الطلب.","We will confirm delivery cost and time with you before preparing the order."],
["طلبك وصلنا.","We got your order."],["فريق ست هيراجع طلبك وهيتواصل معاكي على رقم موبايلك لتأكيد الشحن وتفاصيل الدفع قبل التجهيز.","The SITT team will review your order and contact you on your mobile number to confirm shipping and payment details before preparing it."],
["طلبك بيتراجع قبل التجهيز: هنتواصل معاكي لتأكيد الشحن وتفاصيل الدفع.","Your order is being reviewed: we will contact you to confirm shipping and payment details."],
["رقم طلبك","Your order number"],["، وفريق ست هيتواصل معاكي على",", and the SITT team will contact you on"],["لتأكيد الشحن والدفع.","to confirm shipping and payment."],["جاري حفظ الطلب...","Saving your order..."],
["طلب","Order"],["رقم شحنة شركة الشحن:","Courier tracking no.:"],["طريقة الدفع: عند الاستلام. الدفع الإلكتروني قريبًا.","Payment: cash on delivery. Online payment is coming soon."],["الطلب ده اتلغى.","This order was cancelled."],
["اتستلم الطلب","Order received"],["اتأكد","Confirmed"],["اتشحن","Shipped"],["اتسلّم","Delivered"],["اتسجل عندنا","Registered with us"],["قيد التأكيد","Pending confirmation"],
["اكتبي رقم الطلب ورقم الموبايل اللي طلبتي بيه.","Enter your order number and the mobile number you ordered with."],["تتبع طلبي — ست SITT","Track my order — SITT"],
["مش لاقيين طلب بالبيانات دي. اتأكدي من الرقم وموبايلك.","We couldn't find an order with these details. Check the number and your mobile."],["حصلت مشكلة في الاتصال. جربي تاني بعد شوية.","Connection problem. Please try again in a moment."],
["رقم الموبايل لازم يكون رقم مصري صحيح (01xxxxxxxxx).","The mobile number must be a valid Egyptian number (01xxxxxxxxx)."],["كمّلي البيانات المطلوبة الأول وتأكدي منها، ووافقي على الشروط.","Please complete and check the required details first, and accept the terms."],["كمّلي البيانات المطلوبة الأول، ووافقي على الشروط.","Please complete the required details first, and accept the terms."],
["اتضافت للحقيبة","Added to bag"],["اتضافت للمفضلة","Added to wishlist"],["اتشالت من الحقيبة","Removed from bag"],["اتشالت من المفضلة","Removed from wishlist"],["الحقيبة فاضية. ضيفي قطعة الأول.","Your bag is empty. Add a piece first."],["اتحفظ على جهازك وهيتبعت لينا أول ما الاتصال يرجع","Saved on your device and will be sent to us once the connection is back"],
["اكتبي بريدك الإلكتروني الأول","Enter your email first"],["تمام! هنوصلك أول ما يكون عندنا جديد.","Done! We will let you know as soon as we have something new."],["الفصل الجاي من حكايتنا. سيبي بريدك وهنقولك أول ما ينزل.","The next chapter of our story. Leave your email and we will tell you when it drops."],
["إزالة","Remove"],["الكمية","Qty"],["المقاس","Size"],["المقاس:","Size:"],["اللون:","Color:"],["المقاس ١","Size"],["اللون ١","Color"],["١","1"],
["المفضلة — ست SITT","Wishlist — SITT"],["اختيارات تشبهك.","Picks that look like you."],["لسه مفيش اختيارات؟","No picks yet?"],["قطع قريبة لقلبك.","Pieces close to your heart."],["قطعتين اخترتيهم على ذوقك.","Two pieces chosen to your taste."],["حفظتي قطعتين، خدي وقتك، واختاري حكايتك على مهلك.","You saved two pieces. Take your time and pick your story."],
["المفضلة بتجمع القطع اللي حبيتيها في مكان واحد. اختاري المقاس واللون من صفحة القطعة قبل إضافتها للحقيبة.","The wishlist keeps the pieces you love in one place. Choose size and color on the product page before adding to your bag."],
["المفضلة بتجمع القطع اللي حبيتيها في مكان واحد. تصفحي المجموعة واضغطي على القلب عشان تحفظي القطع اللي شبهك.","The wishlist keeps the pieces you love in one place. Browse the collection and tap the heart to save what looks like you."],
["حسب العنوان","By address"],["٣ قطع","3 pieces"],["٦٥٠ ج.م","EGP 650"],["٩٥٠ ج.م","EGP 950"],["١٬٦٠٠ ج.م","EGP 1,600"],
["الشيميزات — ست SITT","Shirts — SITT"],["شميز...","Shirts..."],["وحكاية حضور.","and a story of presence."],["شميز اللفّة الذهبية — ست SITT","Golden Wrap Shirt — SITT"],["تسوقي الكل — ست SITT","Shop all — SITT"],
["بلوزة بأكمام جرسية واسعة وطباعة ذهبية لآلة العود بأيادٍ عازفة على الصدر، وأزرار برموز مصرية على الأمام.","A blouse with wide bell sleeves, a golden print of an oud played by hands on the chest, and buttons with Egyptian symbols down the front."],
["بلوزة بياقة V وأكمام جرسية واسعة، أزرار برموز مصرية، وزهرة لوتس ذهبية على الصدر وتطريز على الياقة.","A V-neck blouse with wide bell sleeves, Egyptian-symbol buttons, a golden lotus on the chest and embroidery on the collar."],
["قصّة ملفوفة بأزرار مائلة وحاشية مدببة، وخطوط ذهبية بالعنخ والجعران واللوتس على الياقة والكم والحاشية.","A wrap cut with slanted buttons and a pointed hem, with golden lines of ankh, scarab and lotus on the collar, sleeve and hem."],
["قصّة مريحة، ياقة كلاسيكية وأزرار بلون دهبي. تطريز عند الأكمام يكمّل الحكاية من غير ما يطغى على بساطتها.","A comfortable cut with a classic collar and gold-toned buttons. Embroidery at the sleeves completes the story without overpowering its simplicity."],
["اتبعي تعليمات العناية المرفقة بالقطعة. تجنّبي الكي المباشر على التطريز، واحفظيها بعناية مناسبة.","Follow the care instructions attached to the piece. Avoid ironing directly on the embroidery, and store it with care."],
["إزاي تحافظي عليها؟","How to care for it?"],["إزاي تقيسي نفسك؟","How to measure yourself?"],["مقاس على راحتك","A size that suits you"],["محتارة في المقاس؟ إحنا معاكي.","Unsure about size? We are with you."],["راجعي دليل المقاسات قبل الطلب، ولو محتاجة إحنا معاكي.","Check the size guide before ordering, and if you need help we are here."],["راجعي دليل المقاسات، أو ابعتي لنا ونساعدك تختاري القطعة الأنسب ليكي.","Check the size guide, or message us and we will help you choose the right piece."],
["تكلفة ومدة التوصيل بتتحدد حسب عنوانك. لو محتاجة مساعدة في المقاس، تواصلي معانا قبل الطلب.","Delivery cost and time depend on your address. If you need help with size, contact us before ordering."],["اختاري قطعتك، واعرفي إزاي تحافظي عليها من دليل العناية.","Choose your piece, and learn how to care for it from the care guide."],
["الصدر","Chest"],["الصدر:","Chest:"],["الوسط","Waist"],["الوسط:","Waist:"],["الحوض","Hips"],["الحوض:","Hips:"],["عرض صدر القطعة*","Garment chest width*"],
["* عرض صدر القطعة مقاس مسطّح من تحت الإبط للإبط. الطول بيختلف من قطعة لقطعة وهنكتبه في صفحة كل منتج.","* Garment chest width is measured flat, from underarm to underarm. Length varies by piece and is listed on each product page."],
["دليل عام يساعدك تختاري مقاسك. القياسات بالسنتي.","A general guide to help you choose your size. Measurements are in centimeters."],["ده دليل عام بس. لو قياساتك بين مقاسين، اختاري الأكبر لو بتحبي القطعة مريحة. ولو محتارة، كلمينا ونساعدك.","This is a general guide only. If your measurements fall between two sizes, choose the larger for a relaxed fit. If unsure, message us and we will help."],
["لفّي الشريط حوالين أوسع نقطة في الصدر، من غير ما تشدّي.","Wrap the tape around the fullest part of the chest, without pulling."],["حوالين أضيق نقطة في الوسط.","Around the narrowest part of the waist."],["حوالين أوسع نقطة في الحوض.","Around the fullest part of the hips."],
["دليل المقاسات — ست SITT","Size guide — SITT"],["دليل المقاسات −","Size guide −"],
["الشحن والاستبدال — ست SITT","Shipping & exchange — SITT"],["عشان تطلبي وإنتِ مطمّنة.","So you can order with peace of mind."],["الاستبدال والاسترجاع","Exchange and returns"],
["بنوصّل حاليًا للقاهرة والجيزة والإسكندرية.","We currently deliver to Cairo, Giza and Alexandria."],["مصاريف الشحن بتتحدد من شركة الشحن حسب المحافظة، وبيدفعها العميل.","Shipping fees are set by the courier per governorate and paid by the customer."],["بنكلمك على التليفون ونأكد معاكي مصاريف الشحن والطلب قبل ما نشحنه.","We call you to confirm the shipping fee and the order before we ship."],["مدة التوصيل من 2 لـ 5 أيام عمل.","Delivery takes 2 to 5 business days."],["الدفع حاليًا عند الاستلام.","Payment is currently cash on delivery."],
["عندك 14 يوم من تاريخ الاستلام للاستبدال أو الاسترجاع.","You have 14 days from receipt to exchange or return."],["القطعة لازم تكون جديدة، بالتيكيت، ومن غير استخدام.","The piece must be new, with tags, and unworn."],["بنفضّل الاستبدال (مقاس تاني أو قطعة تانية) على الاسترجاع.","We prefer an exchange (another size or another piece) over a refund."],["لو الغلط مننا أو المقاس مش مظبوط: إحنا بنتحمل مصاريف الشحن الراجع.","If it is our mistake or the size is wrong, we cover the return shipping."],["لو غيّرتي رأيك: مصاريف الشحن الراجع على العميلة.","If you changed your mind, return shipping is paid by the customer."],["اتواصلي معانا برقم طلبك وهنرتّب معاكي الخطوات.","Contact us with your order number and we will arrange the steps with you."],
["سياسة الخصوصية — ست SITT","Privacy policy — SITT"],["بياناتك أمانة عندنا.","Your data is a trust with us."],["الاسم (اختياري)","Name (optional)"],["الاسم","Name"],["انتِ ولا انت","She or he"],["اختياري: انتِ ولا انت؟","Optional: she or he?"],["اختياري: انت ولا انت؟","Optional: she or he?"],["انتِ","She"],["انت","He"],["بنجمع الاسم ورقم التليفون والعنوان عشان نوصّل طلبك، وبنستخدمهم للتوصيل وبس.","We collect your name, phone and address to deliver your order, and use them for delivery only."],["لو اشتركتي في النشرة بنحفظ الإيميل، واسمك واختيارك (انتِ/انت) لو كتبتيهم، وهما اختياريين. بنستخدمهم نبعتلك الترحيب والعروض والقطع الجديدة بس، من إيميل البراند.","If you join the newsletter we keep your email, plus your name and your she/he choice if you give them (both optional). We use them only to send you the welcome, offers and new pieces, from the brand email."],["في آخر كل إيميل فيه رابط إلغاء الاشتراك، وبيوقف الرسايل فورًا.","Every email ends with an unsubscribe link that stops messages immediately."],["مبنبيعش بياناتك ومبنشاركهاش مع حد غير شركة الشحن.","We never sell your data or share it with anyone except the courier."],["مبنطلبش ولا بنحفظ بيانات كروت أو باسوردات.","We never ask for or store card details or passwords."],["تقدري تطلبي مسح بياناتك في أي وقت، ابعتيلنا على sittwear1@gmail.com وهنمسحها.","You can ask us to delete your data any time. Email us at sittwear1@gmail.com and we will delete it."],
["الشروط والأحكام — ست SITT","Terms & conditions — SITT"],["باختصار وبوضوح.","Short and clear."],["الأسعار بالجنيه المصري، ومصاريف الشحن بتتأكد معاكي بالتليفون قبل الشحن.","Prices are in Egyptian pounds, and shipping fees are confirmed with you by phone before shipping."],["الطلب بيتأكد بعد مكالمتنا معاكي.","The order is confirmed after we call you."],["التوصيل من 2 لـ 5 أيام عمل.","Delivery takes 2 to 5 business days."],["الاستبدال والاسترجاع خلال 14 يوم من الاستلام، حسب صفحة الشحن والاستبدال.","Exchange and returns within 14 days of receipt, per the shipping & exchange page."],["الألوان ممكن تختلف قليلًا حسب شاشتك.","Colors may differ slightly depending on your screen."],
["تواصلي معانا — ست SITT","Contact us — SITT"],["أي سؤال عن مقاس أو طلب؟ إحنا قريبين.","Any question about a size or an order? We are close."],["بنرد على الرسايل في أقرب وقت.","We reply to messages as soon as we can."],
["حكايتنا — ست SITT","Our story — SITT"],["«ست» اسم بيجمع إلهام الحضارة المصرية بروح الست المصرية النهارده: قوية، حرّة، وليها حضورها الخاص.","\"SITT\" is a name that joins the inspiration of Egyptian civilization with the spirit of today's Egyptian woman: strong, free, and with a presence of her own."],
["إلهام من جذورنا","Inspired by our roots"],["إلهام من زمان.","Inspiration from long ago."],["إنتِ.","You."],["اللي بيرسم فيه.","who draws in it."],
["بتترجم الإلهام ده لقطع معاصرة تلبسيها بطريقتك، مش عشان تبقى ملكة... عشان إنتِ أصلاً ملكة.","We translate that inspiration into contemporary pieces you wear your way, not to make you a queen... because you already are one."],
["بساطة في الفكرة، واختلاف في التفاصيل. تصميمات تعيش معاكي كل يوم.","Simple in idea, different in detail. Designs that live with you every day."],["تفاصيل تعيش معاكي","Details that live with you"],["تفاصيل بتقول كتير.","Details that say a lot."],
["تفاصيل مستوحاة من حكايتنا، بتكمّل حضورك من غير ما تغيّره. قطع بتحكي عنكِ، عشان تبقى إنتِ، بطريقتك.","Details inspired by our story that complete your presence without changing it. Pieces that speak about you, so you stay you, your way."],
["تصميمات للحاضر، وإلهام من جذورنا. اختاري القطعة اللي تشبهك.","Designs for the present, inspired by our roots. Choose the piece that looks like you."],["جاهز ليكي.","Ready for you."],["حضور معاصر","A contemporary presence"],["حكاية اسم، وحكاية كل ست","The story of a name, and of every woman"],
["دي حكاية بتكتبيها بطريقتك.","This is a story you write your way."],["خطوة أقرب لحكايتك.","A step closer to your story."],["رموز على قطعنا","Symbols on our pieces"],["كل رمز على تصميماتنا له معنى. اضغطي على أي كارت تعرفيه.","Every symbol on our designs has a meaning. Tap any card to learn it."],
["عنخ","Ankh"],["الحياة","Life"],["مفتاح الحياة عند القدماء. دايرته للأبد، وعموده بيربط السما بالأرض.","The key of life. Its loop is forever, its stem ties sky to earth."],["اللوتس","Lotus"],["التجدد","Renewal"],["بتقفل بالليل وتتفتح مع أول شمس. بداية جديدة وجمال طالع من الميّه.","It closes at night and opens with the first sun. A fresh start, rising from still water."],["الجعران","Scarab"],["البدايات","Beginnings"],["بيدحرج الشمس قدّامه كل فجر. يعني إن بعد كل ليل صباح جديد.","It rolls the sun ahead of it each dawn. After every night, a new morning."],["عين حورس","Eye of Horus"],["الحماية","Protection"],["بتحمي وتبصّر. كانوا بيرسموها عشان تحفظ صاحبها وتبعد عنه العين.","It guards and sees. Drawn to keep its owner safe and the evil eye away."],
["رمز مصري قديم، بخط دقيق دهبي.","An ancient Egyptian symbol, in fine golden line."],["علامة مميزة","Landmark"],["ألوان ست","SITT colors"],["اختاري لون، والصفحة كلها تلبسه.","Pick a color and the whole page wears it."],
["ست SITT — ملكية بالفطرة، معاصرة باختيارك","SITT — royal by nature, contemporary by choice"],["سِـــــت - SITT","SITT — Set"],["ملكية بالفطرة. معاصرة باختيارك.","Royal by nature. Contemporary by choice."],["ملكة بطبعك","A queen by nature"],["من جذور ملكية","From royal roots"],["من جذور ملكية،","From royal roots,"],["روح مصرية بتكلم لغة النهارده، من غير ما تنسى أصلها.","An Egyptian spirit that speaks today's language without forgetting its origin."],["روح مصرية عريقة بتفاصيل تشبه النهارده. الفصل الأول من حكايتنا.","A deep-rooted Egyptian spirit with details that feel like today. The first chapter of our story."],
["قطع أساسية، بحضور استثنائي. تفاصيل صغيرة بتقول كتير، وإطلالة تفضّل شبهك.","Essential pieces with an exceptional presence. Small details that say a lot, and a look that stays you."],["قطع تكمّل حكايتك","Pieces that complete your story"],["قطع تكمّل شخصيتك، مش تغيّرها. تحكيها عشان تبقى إنتِ.","Pieces that complete your character, not change it. Wear them to stay you."],
["قصّات عصرية تلبسيها في أي يوم.","Modern cuts you can wear any day."],["نفس الجذور، وحكايات مختلفة. اكتشفي باقي الفصل الأول.","Same roots, different stories. Discover the rest of Chapter One."],["ست، مش دور مرسوم ليكي،","SITT is not a role drawn for you,"],["القطعة بتخلص بإنتِ.","The piece is completed by you."],["مش بتتحكي وبس.","It is not only told."],["حكايات بتتلبس،","Stories you wear,"],["كل يوم، حضور بيحكيك.","Every day, a presence that tells your story."],["وحضور للنهارده.","and a presence for today."],["لست النهارده.","for today's woman."],["لبس.","clothes."],["نسيبها ليكي تكمليها","We leave it for you to complete"],["نبدأ من الجذور","We start from the roots"],["نقصّها بروح النهارده","We tell it with today's spirit"],["مصر في التفاصيل","Egypt in the details"],["إزاي بنحكي حكايتنا","How we tell our story"],["لكل ست حكاية","Every woman has a story"],["بطريقتك","your way"],["على طريقتك","Your way"],["مجرد","just"],["جذور","roots"],["حكاية","story"],["إلهام","inspiration"],["إلهام من جذورنا","Inspired by our roots"],["إنتِ","you"],
["اللي","that"],["الأول","first"],["و","and"],["من","from"],["على","on"],["مش","not"],["مصرية","Egyptian"],["بتعدي","passing"],["بتلبسيها،","you wear,"],["النهارده","today"],["قرأت","read"],["وتوافق عليهم.","and agree to them."],["بلغوني","Notify me"],["أي","any"],["اللون","Color"],["على راحتك","at your ease"],["حقيبة التسوق","Shopping bag"],["إتمام الطلب","Checkout"],["الحقيبة ١. بياناتك وعنوانك — ٢. مراجعة وتأكيد الطلب","Bag 1. Your details and address — 2. Review and confirm"],["الإسكندرية","Alexandria"],["مصر","Egypt"]
];
var D={},W=[];P.forEach(function(p){D[p[0]]=p[1]});
[["ج.م","EGP"],["المقاس","Size"],["الكمية","Qty"],["برجندي","Burgundy"],["أسود","Black"],["كريمي","Cream"],["الإجمالي","Total"],["الدفع عند الاستلام","cash on delivery"],["شميز اللفّة الذهبية","Golden Wrap Shirt"],["بلوزة العود الذهبي","Golden Oud Blouse"],["بلوزة جرس اللوتس","Lotus Bell Blouse"],["طلب","Order"],["ست","SITT"],["،",","],["←","→"],["الشروط","terms"],["وأوافق على","and I agree to"]].forEach(function(p){W.push(p)});
var AD='٠١٢٣٤٥٦٧٨٩';
window.SITT_I18N_ADD=function(ps){ps.forEach(function(p){D[p[0]]=p[1]})};
(window.SITT_I18N_Q||[]).forEach(function(ps){window.SITT_I18N_ADD(ps)});
function digits(s){return s.replace(/[٠-٩]/g,function(c){return AD.indexOf(c)}).replace(/٬/g,',')}
var ARX=/[\u0600-\u06FF]/;
function tr(s){
  var m=s.match(/^(\s*)([\s\S]*?)(\s*)$/),k=m[2].replace(/\s+/g,' ');
  if(!k)return s;
  var out;
  if(D.hasOwnProperty(k))out=D[k];
  else{
    var t=k.match(/^(.*) — ست SITT$/);
    if(t&&D.hasOwnProperty(t[1]))out=D[t[1]]+' — SITT';
    else{
      out=k;
      W.forEach(function(p){out=out.split(p[0]).join(p[1])});
      out=digits(out);
      var q=out.split(' / ').map(function(x){return D.hasOwnProperty(x)?D[x]:x});out=q.join(' / ');
    }
  }
  return m[1]+out+m[3];
}
var EN=false,obs=null,busy=false;
var ATTR=['aria-label','placeholder','title','alt'];
function doNode(n){
  if(n.nodeType===3){
    var p=n.parentNode;if(p&&(p.nodeName==='SCRIPT'||p.nodeName==='STYLE'||(p.closest&&p.closest('[data-noi18n]'))))return;
    var v=n.nodeValue;
    if(n._en!==undefined&&v===n._en)return;
    if(!ARX.test(v)&&!/[٠-٩←]/.test(v))return;
    var o=n._ar!==undefined&&n._en===v?n._ar:v;
    n._ar=v;var r=tr(v);n._en=r;
    if(r!==v)n.nodeValue=r;
  }else if(n.nodeType===1){
    if(n.nodeName==='SCRIPT'||n.nodeName==='STYLE'||n.hasAttribute('data-noi18n'))return;
    if(n.nodeName==='OPTION'&&!n.hasAttribute('value'))n.setAttribute('value',n.textContent.trim());
    for(var i=0;i<ATTR.length;i++){var a=ATTR[i],av=n.getAttribute(a);if(av&&ARX.test(av)){if(!n._aa)n._aa={};if(n._aa[a]===undefined||n._aa[a].en!==av){var r2=tr(av);n._aa[a]={ar:av,en:r2};if(r2!==av)n.setAttribute(a,r2)}}}
    for(var c=n.firstChild;c;c=c.nextSibling)doNode(c);
  }
}
function undo(n){
  if(n.nodeType===3){if(n._ar!==undefined&&n._en===n.nodeValue)n.nodeValue=n._ar;n._ar=n._en=undefined}
  else if(n.nodeType===1){
    if(n._aa){for(var a in n._aa){if(n.getAttribute(a)===n._aa[a].en)n.setAttribute(a,n._aa[a].ar)}n._aa=null}
    for(var c=n.firstChild;c;c=c.nextSibling)undo(c);
  }
}
var MF_EN='<b>SITT</b> <b>is</b> <b>not</b> <b>just</b> <b>clothes.</b> <b>SITT</b> <b>is</b> <b>a</b> <b>story</b> <b>you</b> <b>wear,</b> <b>from</b> <b>Egyptian</b> <b>roots</b> <b>reaching</b> <b>into</b> <b>today,</b> <b>your</b> <b>own</b> <b>way.</b>';
var mfAr=null;
function css(){
  if(d.getElementById('i18n-css'))return;
  var s=d.createElement('style');s.id='i18n-css';
  s.textContent='html.en{--font-body:"Amiri",Georgia,serif;--font-display:"Amiri",Georgia,serif;--font-latin:"Amiri",Georgia,serif}'+
  'html.en body,html.en input,html.en select,html.en textarea,html.en button{font-family:"Amiri",Georgia,serif;font-weight:400;letter-spacing:0}'+
  'html.en h1,html.en h2,html.en h3,html.en .display,html.en .brand-word,html.en .card-name{font-family:"Amiri",Georgia,serif;font-weight:700}'+
  'html.en .topbar,html.en .main-nav a,html.en .btn,html.en .chip,html.en .f-col a{letter-spacing:.2px}'+
  'html.en body{font-size:1.06em;line-height:1.6}html.en .brand-word small{display:none}html.en .l-hero .big{font-size:clamp(120px,40vw,280px)}'+
  '.lang[data-lang-btn]{cursor:pointer;padding:6px 8px;border:1px solid transparent;border-radius:14px;user-select:none}.lang[data-lang-btn]:hover{border-color:currentColor}'+
  '#sq-ov{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.45);display:none}#sq-ov.on{display:block}'+
  '#sq-box{background:var(--cream,#ece2d2);color:var(--ink,#2b1d1a);padding:16px 14px 12px;border-bottom:1px solid var(--line,#b99b5f);max-height:80vh;overflow:auto}'+
  '#sq-box .row{display:flex;gap:8px;max-width:640px;margin:0 auto}#sq-box input{flex:1;font-size:16px;padding:12px 14px;border:1px solid var(--line,#b99b5f);border-radius:8px;background:var(--white,#fff);color:var(--ink,#222);min-width:0}'+
  '#sq-box .x{font-size:24px;padding:0 12px;color:inherit;cursor:pointer}'+
  '#sq-res{max-width:640px;margin:10px auto 0}#sq-res a{display:flex;justify-content:space-between;gap:12px;padding:12px 4px;border-top:1px solid var(--line,#b99b5f);color:inherit;text-decoration:none}#sq-res a small{opacity:.7}#sq-res p{padding:12px 4px;margin:0;opacity:.8}'+
  '.sqh{font-size:13px;opacity:.7;max-width:640px;margin:8px auto 0}';
  d.head.appendChild(s);
}
function font(){
  if(d.getElementById('amiri-link'))return;
  var l=d.createElement('link');l.id='amiri-link';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';d.head.appendChild(l);
}
function setLang(en,persist){
  EN=en;css();
  if(persist){try{localStorage.setItem(KEY,en?'en':'ar')}catch(e){}}
  busy=true;if(obs)obs.disconnect();
  if(en){
    font();H.classList.add('en');H.setAttribute('lang','en');H.setAttribute('dir','ltr');
    var mf=d.getElementById('mf');if(mf){if(mfAr===null)mfAr=mf.innerHTML;mf.innerHTML=MF_EN;mf.setAttribute('data-noi18n','1')}
    doNode(d.body);
    if(!d._t)d._t=d.title;d.title=tr(d._t);setTimeout(function(){if(EN&&ARX.test(d.title)){d._t=d.title;d.title=tr(d._t)}},900);
  }else{
    H.classList.remove('en');H.setAttribute('lang','ar');H.setAttribute('dir','rtl');
    var mf2=d.getElementById('mf');if(mf2&&mfAr!==null){mf2.innerHTML=mfAr;mf2.removeAttribute('data-noi18n')}
    undo(d.body);if(d._t)d.title=d._t;
  }
  var lb=d.querySelectorAll('[data-lang-btn]');for(var i=0;i<lb.length;i++)lb[i].textContent=en?'عربي':'EN';
  busy=false;
  if(en){
    if(!obs)obs=new MutationObserver(function(ms){
      if(busy)return;busy=true;obs.disconnect();
      ms.forEach(function(m){if(m.type==='childList'){m.addedNodes.forEach(function(n){doNode(n)})}else if(m.type==='characterData'){doNode(m.target)}else if(m.type==='attributes'){doNode(m.target)}});
      obs.observe(d.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR});busy=false;
    });
    obs.observe(d.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR});
  }
  try{d.dispatchEvent(new CustomEvent('sitt-lang',{detail:en?'en':'ar'}))}catch(e){}
}
/* ---------- search ---------- */
var CAT=[
 {u:'product.html?p=malika',ar:'شميز اللفّة الذهبية',en:'Golden Wrap Shirt',p:950,k:'شميز قميص شيميز لفة ذهبية برجندي اسود كريمي shirt wrap golden burgundy black cream'},
 {u:'product.html?p=oud',ar:'بلوزة العود الذهبي',en:'Golden Oud Blouse',p:950,k:'بلوزة عود ذهبي برجندي blouse oud golden burgundy'},
 {u:'product.html?p=shams',ar:'بلوزة جرس اللوتس',en:'Lotus Bell Blouse',p:650,k:'بلوزة جرس لوتس برجندي blouse lotus bell flare burgundy'}
];
(window.SITT_CAT||[]).forEach(function(p){var o={u:'product.html?p='+p.id,ar:p.name,en:p.nameEn||p.name,p:p.price,k:(p.name+' '+(p.nameEn||'')).toLowerCase()},f=-1;CAT.forEach(function(x,n){if(x.u===o.u)f=n});if(f>-1)CAT[f]=Object.assign(CAT[f],{ar:o.ar,en:o.en,p:o.p});else CAT.push(o)});
function norm(s){return String(s).toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ّ/g,'').trim()}
function money(n){return EN?'EGP '+n.toLocaleString('en-US'):String(n.toLocaleString('en-US')).replace(/\d/g,function(c){return AD[c]}).replace(/,/g,'٬')+' ج.م'}
var ov=null;
function buildSearch(){
  if(ov)return;
  ov=d.createElement('div');ov.id='sq-ov';
  ov.innerHTML='<div id="sq-box"><div class="row"><input id="sq-in" type="search" autocomplete="off" enterkeyhint="search"><span class="x" id="sq-x" role="button" aria-label="close">×</span></div><div class="sqh" id="sq-h"></div><div id="sq-res"></div></div>';
  d.body.appendChild(ov);
  var inp=d.getElementById('sq-in');
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.id==='sq-x')closeS()});
  inp.addEventListener('input',run);
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'){var a=d.querySelector('#sq-res a');if(a)location.href=a.href}else if(e.key==='Escape')closeS()});
}
function run(){
  var q=norm(d.getElementById('sq-in').value),box=d.getElementById('sq-res');
  if(!q){box.innerHTML='';return}
  var toks=q.split(/\s+/),hits=CAT.filter(function(c){var hay=norm(c.ar+' '+c.en+' '+c.k);return toks.every(function(t){return hay.indexOf(t)>-1})});
  if(!hits.length){box.innerHTML='<p>'+(EN?'No products found.':'مفيش منتجات مطابقة.')+'</p>';return}
  box.innerHTML=hits.map(function(c){return '<a href="'+c.u+'"><span>'+(EN?c.en:c.ar)+'</span><small>'+money(c.p)+'</small></a>'}).join('');
}
function openS(){
  buildSearch();var i=d.getElementById('sq-in');
  i.placeholder=EN?'Search products':'ابحثي عن منتج';d.getElementById('sq-h').textContent=EN?'Search by name, color or type':'ابحثي بالاسم أو اللون أو النوع';
  ov.classList.add('on');i.value='';d.getElementById('sq-res').innerHTML='';setTimeout(function(){i.focus()},50);
}
function closeS(){if(ov)ov.classList.remove('on')}
function init(){
  css();
  var lg=d.querySelectorAll('.header-actions .lang');
  for(var i=0;i<lg.length;i++){var e=lg[i];e.setAttribute('data-lang-btn','1');e.setAttribute('data-noi18n','1');e.setAttribute('role','button');e.setAttribute('tabindex','0');e.setAttribute('aria-label','Language');
    e.addEventListener('click',function(){setLang(!EN,true)});e.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();setLang(!EN,true)}})}
  var sb=d.querySelectorAll('.header-actions button.icon-btn');
  for(var j=0;j<sb.length;j++){if(sb[j].querySelector('circle')&&sb[j].getAttribute('aria-label')==='بحث'){sb[j].setAttribute('data-search','1');sb[j].addEventListener('click',function(ev){ev.preventDefault();openS()})}}
  d.addEventListener('keydown',function(e){if(e.key==='Escape')closeS()});
  var s;try{s=localStorage.getItem(KEY)}catch(e){}
  if(/[?&]lang=en/.test(location.search))s='en';if(s==='en')setLang(true,false);
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
})();
