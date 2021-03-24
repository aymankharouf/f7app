export const setup = {
  fixedFees: 0.01,
  maxDiscount: 10,
  firstOrderDiscount: 10,
  orderLimit: 5000,
  profit: 0.05,
  locale: 'en'
}

export const randomColors = [
  {id: 0, name: '#FF3B30'},
  {id: 1, name: '#4CD964'},
  {id: 2, name: '#2196F3'},
  {id: 3, name: '#FF2D55'},
  {id: 4, name: '#FFCC00'},
  {id: 5, name: '#FF9500'},
  {id: 6, name: '#9C27B0'},
  {id: 7, name: '#673AB7'},
  {id: 8, name: 'lightblue'},
  {id: 9, name: 'teal'},
]

export const sortByList = [
  {id: 'p', name: 'اﻷقل سعرا', ename: 'Least Price'},
  {id: 's', name: 'اﻷكثر مبيعا', ename: 'Best Seller'},
  {id: 'r', name: 'اﻷفضل في التقييم', ename: 'Best Rating'},
  {id: 'o', name: 'العروض أولا', ename: 'Offers First'},
  {id: 'v', name: 'اﻷفضل قيمة (السعر/الوزن)', ename: 'Best Value'},
]

export const orderStatus = [
  {id: 'n', name: 'قيد الموافقة', ename: 'New'},
  {id: 'a', name: 'تمت الموافقة', ename: 'Approved'},
  {id: 's', name: 'معلق', ename: 'Suspended'},
  {id: 'r', name: 'مرفوض', ename: 'Rejected'},
  {id: 'e', name: 'قيد التنفيذ', ename: 'Processing'},
  {id: 'f', name: 'تم التنفيذ', ename: 'Finished'},
  {id: 'p', name: 'جاهز', ename: 'Processed'},
  {id: 'd', name: 'مستلم', ename: 'Delivered'},
  {id: 'c', name: 'ملغي', ename: 'Canceled'},
  {id: 'u', name: 'غير متوفر', ename: 'Unavailable'},
  {id: 'i', name: 'استيداع', ename: 'in-stock'},
  {id: 'm', name: 'مدمج', ename: 'Merged'}
]  

export const orderPackStatus = [
  {id: 'n', name: 'قيد الشراء', ename: 'New'},
  {id: 'p', name: 'شراء جزئي', ename: 'Purchasing'},
  {id: 'f', name: 'تم الشراء', ename: 'Finished'},
  {id: 'u', name: 'غير متوفر', ename: 'Unavailable'},
  {id: 'pu', name: 'شراء جزئي والباقي غير متوفر', ename: 'Partial Purchased'},
  {id: 'r', name: 'مرتجع', ename: 'Returned'},
  {id: 'pr', name: 'مرتجع جزئي', ename: 'Partial Returned'}
]

export const alarmTypes = [
  {id: 'cp', name: 'الابلاغ عن تغيير السعر', ename: 'Price Changes', isAvailable: 1},
  {id: 'av', name: 'الابلاغ عن توفر هذا المنتج/العرض', ename: 'Availability', isAvailable: -1},
  {id: 'ua', name: 'الابلاغ عن عدم توفر هذا المنتج/العرض', ename: 'Not Available', isAvailable: 1},
  {id: 'aa', name: 'الابلاغ عن توفر بديل', ename: 'Alternative Available', isAvailable: 0},
  {id: 'eo', name: 'الابلاغ عن عرض لقرب انتهاء الصلاحية', ename: 'Expiry Offers', isAvailable: 0},
  {id: 'go', name: 'الابلاغ عن عرض لمجموعة', ename: 'Group Offers', isAvailable: 0},
]

export const storeSummary = [
  {id: 'a', name: 'كل المنتجات', ename: 'All Products'},
  {id: 'o', name: 'منتجات اعلى من السوق', ename: 'Over Priced'},
  {id: 'n', name: 'منتجات مساوية للسوق', ename: 'Equal Price'},
  {id: 'l', name: 'منتجات أقل سعر في السوق', ename: 'Under Priced'}
]

export const friendStatus = [
  {id: 'n', name: 'قيد الموافقة', ename: 'New'},
  {id: 's', name: 'ارسلت الدعوة', ename: 'Invitation Sent'},
  {id: 'o', name: 'مدعو سابقا', ename: 'Previously invited'},
  {id: 'r', name: 'مستخدم فعلي', ename: 'Actual User'}
]

export const pageTitles = [
  {path: '/', title: 'CRM'},
  {path: '/search', title: 'كل المنتجات'},
  
]