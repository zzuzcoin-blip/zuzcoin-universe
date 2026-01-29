// ZUZIM Trading Engine
// Профессиональные графики, свечи, индикаторы

class TradingEngine {
    constructor() {
        this.pair = 'ZUZ/USDT';
        this.timeframe = '1h';
        this.data = [];
        this.indicators = {
            ma: true,
            rsi: true,
            macd: false,
            bollinger: false,
            volume: true
        };
        
        this.initChart();
        this.loadSampleData();
        console.log("📈 Trading Engine started");
    }

    // Инициализация графика
    initChart() {
        // Создаем канвас если нет
        if (!document.getElementById('trading-chart')) {
            this.createChartContainer();
        }
        
        this.canvas = document.getElementById('trading-chart');
        this.ctx = this.canvas.getContext('2d');
        
        // Настройки
        this.candleWidth = 8;
        this.padding = {
            top: 30,
            right: 50,
            bottom: 70,
            left: 70
        };
        
        // Инициализируем размер
        this.resizeChart();
        window.addEventListener('resize', () => this.resizeChart());
    }

    createChartContainer() {
        const container = document.createElement('div');
        container.className = 'chart-container';
        container.innerHTML = `
            <div class="chart-controls">
                <div class="timeframe-selector">
                    <button class="tf-btn active" data-tf="1m">1m</button>
                    <button class="tf-btn" data-tf="5m">5m</button>
                    <button class="tf-btn" data-tf="15m">15m</button>
                    <button class="tf-btn" data-tf="1h">1h</button>
                    <button class="tf-btn" data-tf="4h">4h</button>
                    <button class="tf-btn" data-tf="1d">1d</button>
                </div>
                <div class="indicator-selector">
                    <label><input type="checkbox" checked> MA</label>
                    <label><input type="checkbox" checked> RSI</label>
                    <label><input type="checkbox"> MACD</label>
                    <label><input type="checkbox"> BB</label>
                    <label><input type="checkbox" checked> Volume</label>
                </div>
            </div>
            <div class="chart-area">
                <canvas id="trading-chart"></canvas>
                <canvas id="volume-chart" style="height: 100px;"></canvas>
                <canvas id="indicator-chart" style="height: 80px;"></canvas>
            </div>
        `;
        
        // Ищем куда вставить
        const target = document.querySelector('.trading-center') || 
                      document.querySelector('.main-content') ||
                      document.body;
        target.appendChild(container);
    }

    resizeChart() {
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const width = container.clientWidth - 20;
        const height = 400;
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        this.drawChart();
    }

    // Загружаем демо данные
    loadSampleData() {
        // Генерируем 100 свечей
        const now = Date.now();
        const candles = [];
        let price = 0.05;
        
        for (let i = 0; i < 100; i++) {
            const time = now - (100 - i) * 3600000; // 1 час интервал
            const open = price;
            const change = (Math.random() - 0.5) * 0.01; // ±1%
            const high = open + Math.abs(change * 2);
            const low = open - Math.abs(change * 1.5);
            const close = open + change;
            const volume = Math.random() * 10000 + 5000;
            
            candles.push({
                time,
                open,
                high,
                low,
                close,
                volume
            });
            
            price = close;
        }
        
        this.data = candles;
        this.drawChart();
    }

    // Рисуем график
    drawChart() {
        if (!this.data.length || !this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рассчитываем масштаб
        const prices = this.data.map(d => [d.low, d.high]).flat();
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;
        
        const chartHeight = this.canvas.height - this.padding.top - this.padding.bottom;
        const chartWidth = this.canvas.width - this.padding.left - this.padding.right;
        
        // Сетка
        this.drawGrid(minPrice, maxPrice, priceRange, chartHeight, chartWidth);
        
        // Свечи
        this.drawCandles(chartHeight, chartWidth, minPrice, priceRange);
        
        // Индикаторы
        if (this.indicators.ma) {
            this.drawMA(chartHeight, chartWidth, minPrice, priceRange);
        }
        
        // Заголовок
        this.drawTitle();
    }

    drawGrid(minPrice, maxPrice, priceRange, chartHeight, chartWidth) {
        this.ctx.strokeStyle = '#2a2f42';
        this.ctx.lineWidth = 1;
        
        // Вертикальные линии
        for (let i = 0; i <= 10; i++) {
            const x = this.padding.left + (i * chartWidth / 10);
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.padding.top);
            this.ctx.lineTo(x, this.padding.top + chartHeight);
            this.ctx.stroke();
        }
        
        // Горизонтальные линии (цены)
        for (let i = 0; i <= 8; i++) {
            const y = this.padding.top + (i * chartHeight / 8);
            const price = maxPrice - (i * priceRange / 8);
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding.left, y);
            this.ctx.lineTo(this.padding.left + chartWidth, y);
            this.ctx.stroke();
            
            // Подписи цен
            this.ctx.fillStyle = '#666';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(price.toFixed(6), this.padding.left - 5, y + 4);
        }
        
        // Подписи времени
        const times = this.getTimeLabels();
        times.forEach((time, i) => {
            const x = this.padding.left + (i * chartWidth / (times.length - 1));
            this.ctx.fillStyle = '#666';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(time, x, this.canvas.height - 20);
        });
    }

    drawCandles(chartHeight, chartWidth, minPrice, priceRange) {
        const candleSpacing = 2;
        const availableWidth = chartWidth - (this.data.length * candleSpacing);
        const candleWidth = Math.min(this.candleWidth, availableWidth / this.data.length);
        
        this.data.forEach((candle, i) => {
            const x = this.padding.left + (i * (candleWidth + candleSpacing));
            
            // Координаты
            const yHigh = this.padding.top + ((maxPrice - candle.high) / priceRange) * chartHeight;
            const yLow = this.padding.top + ((maxPrice - candle.low) / priceRange) * chartHeight;
            const yOpen = this.padding.top + ((maxPrice - candle.open) / priceRange) * chartHeight;
            const yClose = this.padding.top + ((maxPrice - candle.close) / priceRange) * chartHeight;
            
            const isBullish = candle.close >= candle.open;
            const color = isBullish ? '#00c087' : '#f6465d';
            
            // Тень (wick)
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x + candleWidth/2, yHigh);
            this.ctx.lineTo(x + candleWidth/2, yLow);
            this.ctx.stroke();
            
            // Тело свечи
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.abs(yOpen - yClose);
            
            if (bodyHeight > 0) {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
                
                // Обводка тела
                this.ctx.strokeStyle = color;
                this.ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);
            }
        });
    }

    drawMA(chartHeight, chartWidth, minPrice, priceRange) {
        const ma7 = this.calculateMA(7);
        const ma25 = this.calculateMA(25);
        
        this.drawLine(ma7, chartHeight, chartWidth, minPrice, priceRange, '#ff9900', 'MA7');
        this.drawLine(ma25, chartHeight, chartWidth, minPrice, priceRange, '#0ea5e9', 'MA25');
    }

    calculateMA(period) {
        const result = [];
        
        for (let i = 0; i < this.data.length; i++) {
            if (i < period - 1) {
                result.push(null);
                continue;
            }
            
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += this.data[i - j].close;
            }
            
            result.push(sum / period);
        }
        
        return result;
    }

    drawLine(values, chartHeight, chartWidth, minPrice, priceRange, color, label) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const candleWidth = this.candleWidth;
        const candleSpacing = 2;
        
        values.forEach((value, i) => {
            if (value === null) return;
            
            const x = this.padding.left + (i * (candleWidth + candleSpacing)) + candleWidth/2;
            const y = this.padding.top + ((maxPrice - value) / priceRange) * chartHeight;
            
            if (i === 0 || values[i-1] === null) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // Легенда
        this.ctx.fillStyle = color;
        this.ctx.font = '12px Arial';
        this.ctx.fillText(label, 10, 20);
    }

    getTimeLabels() {
        if (!this.data.length) return [];
        
        const times = [];
        const interval = Math.floor(this.data.length / 6);
        
        for (let i = 0; i < this.data.length; i += interval) {
            if (i >= this.data.length) break;
            
            const date = new Date(this.data[i].time);
            const timeStr = date.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            times.push(timeStr);
        }
        
        // Добавляем последнее время
        const lastDate = new Date(this.data[this.data.length - 1].time);
        const lastTime = lastDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        times.push(lastTime);
        
        return times;
    }

    drawTitle() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.pair} - ${this.timeframe}`, 10, 20);
        
        if (this.data.length > 0) {
            const last = this.data[this.data.length - 1];
            const change = ((last.close - last.open) / last.open) * 100;
            const changeColor = change >= 0 ? '#00c087' : '#f6465d';
            
            this.ctx.fillStyle = changeColor;
            this.ctx.font = '14px Arial';
            this.ctx.fillText(`$${last.close.toFixed(6)} (${change.toFixed(2)}%)`, 150, 20);
        }
    }

    // Обновление данных в реальном времени
    updateLiveData(newCandle) {
        this.data.push(newCandle);
        if (this.data.length > 200) {
            this.data.shift();
        }
        this.drawChart();
    }

    // Меняем таймфрейм
    changeTimeframe(tf) {
        this.timeframe = tf;
        console.log(`Changed timeframe to ${tf}`);
        // Здесь будет загрузка новых данных
        this.drawChart();
    }

    // Включаем/выключаем индикаторы
    toggleIndicator(indicator) {
        this.indicators[indicator] = !this.indicators[indicator];
        this.drawChart();
    }
}

// Стакан ордеров
class OrderBook {
    constructor() {
        this.bids = [];
        this.asks = [];
        this.maxOrders = 20;
        
        this.generateSampleData();
        this.init();
    }

    init() {
        this.render();
        // Симуляция обновлений
        setInterval(() => this.updateRandomOrder(), 3000);
    }

    generateSampleData() {
        let price = 0.0567;
        
        // Биды (покупка)
        for (let i = 0; i < this.maxOrders; i++) {
            const orderPrice = price - (i * 0.0001);
            const amount = Math.random() * 1000 + 500;
            const total = orderPrice * amount;
            
            this.bids.push({
                price: orderPrice,
                amount: amount.toFixed(2),
                total: total.toFixed(2)
            });
        }
        
        // Аски (продажа)
        for (let i = 0; i < this.maxOrders; i++) {
            const orderPrice = price + (i * 0.0001);
            const amount = Math.random() * 1000 + 500;
            const total = orderPrice * amount;
            
            this.asks.push({
                price: orderPrice,
                amount: amount.toFixed(2),
                total: total.toFixed(2)
            });
        }
        
        // Сортируем
        this.bids.sort((a, b) => b.price - a.price);
        this.asks.sort((a, b) => a.price - b.price);
    }

    render() {
        const container = document.getElementById('orderbook-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="orderbook">
                <div class="orderbook-header">
                    <h3>Order Book</h3>
                    <div class="spread">Spread: 0.05%</div>
                </div>
                <div class="orderbook-content">
                    <div class="asks">
                        ${this.asks.slice(0, 10).map(order => this.renderOrderRow(order, 'ask')).join('')}
                    </div>
                    <div class="orderbook-middle">
                        <div class="current-price">$${(0.056789).toFixed(6)}</div>
                        <div class="depth-info">Depth: 0.1%</div>
                    </div>
                    <div class="bids">
                        ${this.bids.slice(0, 10).map(order => this.renderOrderRow(order, 'bid')).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderOrderRow(order, type) {
        const color = type === 'bid' ? '#00c087' : '#f6465d';
        return `
            <div class="order-row ${type}">
                <span class="price" style="color: ${color}">${order.price.toFixed(6)}</span>
                <span class="amount">${order.amount}</span>
                <span class="total">${parseFloat(order.total).toFixed(2)}</span>
                <div class="depth-bar" style="
                    width: ${(parseFloat(order.amount) / 5000) * 100}%;
                    background: ${type === 'bid' ? 'rgba(0, 192, 135, 0.2)' : 'rgba(246, 70, 93, 0.2)'};
                "></div>
            </div>
        `;
    }

    updateRandomOrder() {
        // Рандомное обновление для демо
        if (Math.random() > 0.5) {
            const index = Math.floor(Math.random() * this.bids.length);
            this.bids[index].amount = (Math.random() * 1000 + 500).toFixed(2);
            this.bids[index].total = (this.bids[index].price * this.bids[index].amount).toFixed(2);
        } else {
            const index = Math.floor(Math.random() * this.asks.length);
            this.asks[index].amount = (Math.random() * 1000 + 500).toFixed(2);
            this.asks[index].total = (this.asks[index].price * this.asks[index].amount).toFixed(2);
        }
        
        this.render();
    }
}

// Глобальный доступ
window.tradingEngine = new TradingEngine();
window.orderBook = new OrderBook();

console.log('✅ Trading Engine loaded');
