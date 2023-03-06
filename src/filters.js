import moment from "moment";

export default {
    date(value) {
        if (value) {
            return moment(String(value)).format('DD-MMM-YY')
        }
        return '';
    },

    year(value) {
        if (value) {
            return value + ' YRS'
        } else {
            return value
        }
    },

    formattedValue(value, isPercentage = true) {
        if (value) {
            if (isPercentage) {
                return value.toFixed(3) + '%';
            } else {
                if (value < 0) {
                    return value.toFixed(0) + 'bp';
                } else {
                    return '+' + value.toFixed(0) + 'bp';
                }
            }
        } else {
            return '';
        }
    }
}