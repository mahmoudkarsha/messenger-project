export default function ErrorHandler(error) {
    if (error.response) {
        return error?.response?.data?.message || 'خطأ في البيانات';
    } else if (error.request) {
        return 'خطأ في الإتصال تأكد من اتصالك بالشبكة وحاول مجدداً.';
    } else {
        return 'حدث خطأ ما.';
    }
}
