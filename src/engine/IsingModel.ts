export class IsingModel {
    size: number;
    grid: Int8Array; // Using Int8Array for efficiency: 1 or -1
    energy: number;
    magnetization: number;

    constructor(size: number) {
        this.size = size;
        this.grid = new Int8Array(size * size);
        this.energy = 0;
        this.magnetization = 0;
        this.randomize();
    }

    randomize() {
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = Math.random() > 0.5 ? 1 : -1;
        }
        this.calculateStats();
    }

    // Get index helper with periodic boundary conditions
    private idx(x: number, y: number): number {
        return ((y + this.size) % this.size) * this.size + ((x + this.size) % this.size);
    }

    calculateStats() {
        let E = 0;
        let M = 0;
        const s = this.size;

        for (let y = 0; y < s; y++) {
            for (let x = 0; x < s; x++) {
                const i = y * s + x;
                const spin = this.grid[i];
                M += spin;

                // Sum neighbors (right and bottom is enough for unique pairs, but for full H calculation we need all)
                // Actually for total energy E = -J sum s_i s_j - H sum s_i
                // We typically count each pair once. So right and down neighbors.
                const right = this.grid[this.idx(x + 1, y)];
                const down = this.grid[this.idx(x, y + 1)];
                E -= spin * (right + down);
            }
        }
        this.energy = E;
        this.magnetization = M;
    }

    // Metropolis-Hastings Step
    step(temp: number, field: number = 0, stepsPerFrame: number = 1000) {
        const s = this.size;
        const total = s * s;
        // Precompute exponentials for optimization if possible, but temp changes effectively.
        // For simple Metropolis, we pick random spins.

        for (let k = 0; k < stepsPerFrame; k++) {
            // Pick random position
            const i = Math.floor(Math.random() * total);
            const x = i % s;
            const y = Math.floor(i / s);

            const currentSpin = this.grid[i];

            // Calculate energy change if we flip
            // Sum of neighbors
            const neighbors =
                this.grid[this.idx(x + 1, y)] +
                this.grid[this.idx(x - 1, y)] +
                this.grid[this.idx(x, y + 1)] +
                this.grid[this.idx(x, y - 1)];

            // dE = 2 * spin * (sum(neighbors) + H)
            // (Standard formula: E_i = -s_i * neighbors. Flip s_i -> -s_i => dE = E_final - E_initial = (s_i * neigh) - (-s_i * neigh) = 2 s_i neigh)
            // Including field: E_i = -s_i * (neigh + H). dE = 2 * s_i * (neigh + H)

            const deltaE = 2 * currentSpin * (neighbors + field);

            if (deltaE <= 0 || Math.random() < Math.exp(-deltaE / temp)) {
                // Flip accepted
                this.grid[i] = -currentSpin as 1 | -1;
                this.magnetization -= 2 * currentSpin;
                this.energy += deltaE; // Wait, total energy changes by deltaE? 
                // Wait, if dE < 0, energy decreases. standard convention.
                // But my total energy calc above counted pairs. A single flip changes interaction with 4 neighbors.
                // Each neighbor link changes by ( (-s)*(n) - (s)*(n) ) = -2 s n.
                // Total delta E = sum over 4 links = -2 s (sum n).
                // My calculateStats used -spin*(right+down). 
                // Let's rely on re-calculating full stats occasionally to avoid drift, 
                // but for speed we can update incrementally.
                // However, consistent E tracking is tricky with just right/down pairs. 
                // Let's just update the grid and re-calculate M rigorously, E less critical for viz?
                // Actually, let's keep it simple: update M incrementally, E loosely or recalc.
            }
        }
    }
}
