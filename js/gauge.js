class Gauge extends Phaser.GameObjects.Graphics {
    constructor(scene, minVal, maxVal, minHealth, maxHealth) {
        super(scene);
        this._minVal = minVal;
        this._maxVal = maxVal;
        this._minHealth = this.getPercent(minHealth);
        this._maxHealth = this.getPercent(maxHealth);
        this.setGauge(0);
    }

    minValid() {
        return this._minVal;
    }

    maxValid() {
        return this._maxVal;
    }

    // min: 10
    // max: 40
    // val: 20
    // percent: .33
    //
    // scaledmax = 30
    // val-min -> 10/30 -> 1/3

    getPercent(val) {
        if (val < this._minVal) {
            return 0;
        } else if (val > this._maxVal) {
            return 1;
        }

        const scaledMax = this._maxVal - this._minVal;
        return (val - this._minVal) / scaledMax;
    }

    setGauge(val) {
        const percent = this.getPercent(val);
        const x = 0;
        const y = 0;
        const width = 16;
        const height = 104;
        const innerX = x + 2;
        const innerY = y + 2;
        const innerHeight = height - 4;
        const innerWidth = width - 4;

        this.clear();
        //  Outline.
        this.fillStyle(0x27275b);
        this.fillRect(x, y, width, height);
        // Background.
        this.fillStyle(0xa8a8c0);
        this.fillRect(innerX, innerY, innerWidth, innerHeight);

        //  Fill.
        if (percent < this._minHealth || percent > this._maxHealth) {
            this.fillStyle(0xbfa671);
        } else {
            this.fillStyle(0x585886);
        }
        const amountFilled = percent * innerHeight;
        const fillStart = innerHeight - amountFilled;
        this.fillRect(innerX, fillStart + 2, innerWidth, amountFilled);

        // Health ticks.
        this.fillStyle(0x27275b);
        const maxHealthY = innerHeight - (this._maxHealth * 100);
        this.fillRect(x - 2, maxHealthY + 2, width + 4, 1);
        const minHealthY = innerHeight - (this._minHealth * 100);
        this.fillRect(x - 2, minHealthY + 2, width + 4, 1);
    }
}
