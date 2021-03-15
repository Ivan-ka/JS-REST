
function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}


var messageApi = Vue.resource('/quotes{/id}');


Vue.component('message-form', {
    props: ['messages', 'messageAtr', 'chartMethod'],

    data: function () {
        return {
            id: '',
            date: '',
            stock: '',
            price: ''
        }
    },

    watch: {
        messageAtr: function (newVal) {
            this.id = newVal.id;
            this.date = newVal.date;
            this.stock = newVal.stock;
            this.price = newVal.price;
        }
    },

    template:
        '<div>' +
            '<input type="text" placeholder="Write date" v-model="date" />' +
            '<input type="text" placeholder="Write stock" v-model="stock" />' +
            '<input type="text" placeholder="Write price" v-model="price" />' +
            '<input type="reset" value="Reset" @click="reset" />' +
            '<input type="button" value="Save" @click="save" />' +
        '</div>',

    methods: {
        reset: function () {
            this.date = '',
            this.stock = '',
            this.price = ''
        },

        save: function () {
            var message = {id: this.id, date: this.date, stock: this.stock, price: this.price};

            if (this.id) {
                messageApi.update({id: this.id}, message).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.messages, data.id);
                        this.messages.splice(index, 1, data);
                        this.chartMethod(data);
                    })
                )
            } else {
                messageApi.save({}, message).then(result =>
                    result.json().then(data => {
                        this.messages.push(data);
                        this.chartMethod(data);
                    })
                )
            }
            this.date = '',
            this.stock = '',
            this.price = '',
            this.id = ''
        }
    }
});


Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages', 'chartMethod'],

    template:
        '<div>' +
            '<table border="1">' +
                '<tbody>' +
                    '<tr>' +
                        '<td width="10%" align="center">{{ message.id }}</td>' +
                        '<td width="30%" align="center">{{ message.date }}</td>' +
                        '<td width="30%" align="center">{{ message.stock }}</td>' +
                        '<td width="10%" align="center">{{ message.price }}</td>' +
                        '<td>' +
                            '<span>' +
                                '<input type="button" value="Edit" @click="edit" />' +
                                '<input type="button" value="X" @click="del" />' +
                                '<input type="button" value="Chart" @click="chart" />' +
                            '</span>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
        '</div>',

    methods: {
        edit: function() {
            this.editMethod(this.message);
        },

        del: function() {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                    var messageTemp = this.message;
                    this.messages.splice(this.messages.indexOf(this.message), 1)
                    this.chartMethod(messageTemp);
                }
            })
        },

        chart: function() {
            this.chartMethod(this.message);
        }
    }
});


Vue.component('line-chart', {
    extends: VueChartJs.Line,
    props: ['dateAtr', 'priceAtr', 'stockNameAtr', 'messages'],

    mounted() {
        this.renderLineChart();
    },

    watch: {
        dateAtr: function () {
            this.renderLineChart();
        },

        priceAtr: function () {
            this.renderLineChart();
        },

        stockNameAtr: function () {
            this.renderLineChart();
        }
    },

    methods: {
        renderLineChart: function() {
            this.renderChart(
                {
                    labels: this.dateAtr,
                    datasets: [
                        {
                            label: this.stockNameAtr,
                            data: this.priceAtr,
                            backgroundColor: "rgba(71, 183,132,.5)",
                            borderColor: "#47b784",
                            borderWidth: 2
                        }
                    ]
                },
                { responsive: true, maintainAspectRatio: true }
            );
        }
    },
});


Vue.component('messages-list', {
    props: ['messages', 'messagesByName', 'date', 'price', 'stockName'],

    data: function () {
        return {
            messageAtr: null,
            messagesByNameAtr: this.messagesByName,
            dateAtr: this.date,
            priceAtr: this.price,
            stockNameAtr: this.stockName
        }
    },

    template:
        '<div>' +
            '<message-form :messages="messages" :messageAtr="messageAtr" :chartMethod="chartMethod" />' +
            '<message-row v-for="message in messages" :key="message.id" :message="message" ' +
                ':editMethod="editMethod" :messages="messages" :chartMethod="chartMethod" />' +
            '<line-chart :dateAtr="dateAtr" :priceAtr="priceAtr" :stockNameAtr="stockNameAtr" :messages="messages" ' +
                ':width="1000" :height="300" />' +
        '</div>',

    created: function () {
        messageApi.get().then(result =>
            result.json().then(data =>
                // console.log(data)
                data.forEach(message => this.messages.push(message)
                )
            )
        )
    },

    methods: {
        editMethod: function(message) {
            this.messageAtr = message;
        },

        chartMethod: function(message) {
            this.messagesByNameAtr = this.messages.filter(item => item.stock === message.stock)
            this.dateAtr = this.messagesByNameAtr.map(item => item.date)
            this.priceAtr = this.messagesByNameAtr.map(item => item.price)
            this.stockNameAtr = message.stock
        }
    }
});


var app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages" :messagesByName="messagesByName" :date="date" :price="price" :stockName="stockName"/>',
    data: {
        messages: [],
        messagesByName: [],
        date: [],
        price: [],
        stockName: ''
    }
});
