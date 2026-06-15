export enum TimeFormat {
    /**
     * Zero-padded 24 hour
     */
    HHmmss = 'HH:mm:ss',
    /**
     * 24 hour
     */
    Hmmss = 'H:mm:ss',
    /**
     * Zero-padded 12 hour AM/PM
     */
    hhmmssa = 'hh:mm:ss a',
    /**
     * 12 hour AM/PM
     */
    hmmssa = 'h:mm:ss a',
}

export enum DateFormat {
    /**
     * Short day of the week day zero-padded month year
     * @example Wed 17/06/2026
     */
    EEEddMMyyyy = 'EEE dd/MM/yyyy',
    /**
     * Day of the week day zero-padded month year
     * @example Wednesday 17/06/2026
     */
    EEEEddMMyyyy = 'EEEE dd/MM/yyyy',
    /**
     * Day short month, year
     * @example Wed, 17 Jun, 2026
     */
    EEEdMMMyyyy = 'EEE, d MMM, yyyy',
    /**
     * Day short month, year
     * @example Wednesday, 17 Jun, 2026
     */
    EEEEdMMMyyyy = 'EEEE, d MMM, yyyy',
    /**
     * Day long month, year
     * @example Wed, 17 June, 2026
     */
    EEEdMMMMyyyy = 'EEE, d MMMM, yyyy',
    /**
     * Day long month, year
     * @example Wednesday, 17 June, 2026
     */
    EEEEdMMMMyyyy = 'EEEE, d MMMM, yyyy',
    /**
     * Day zero-padded month year
     * @example 17/06/2026
     */
    ddMMyyyy = 'dd/MM/yyyy',
    /**
     * Day short month, year
     * @example 17 Jun, 2026
     */
    dMMMyyyy = 'd MMM, yyyy',
    /**
     * Day long month, year
     * @example 17 June, 2026
     */
    dMMMMyyyy = 'd MMMM, yyyy',

    /**
     * Short day of the week zero-padded month day year
     * @example Wed 06/17/2026
     */
    EEEMMddyyyy = 'EEE MM/dd/yyyy',
    /**
     * Day of the week zero-padded month day year
     * @example Wednesday 06/17/2026
     */
    EEEEMMddyyyy = 'EEEE MM/dd/yyyy',
    /**
     * Day short month, year
     * @example Wed, 17 Jun, 2026
     */
    EEEMMMdyyyy = 'EEE, MMM d, yyyy',
    /**
     * Day short month, year
     * @example Wednesday, Jun 17, 2026
     */
    EEEEMMMdyyyy = 'EEEE, MMM d, yyyy',
    /**
     * Day long month, year
     * @example Wed, 17 June, 2026
     */
    EEEMMMMdyyyy = 'EEE, MMMM d, yyyy',
    /**
     * Day long month, year
     * @example Wednesday, June 17, 2026
     */
    EEEEMMMMdyyyy = 'EEEE, d MMMM, yyyy',
    /**
     * Zero-padded month day year
     * @example 06/17/2026
     */
    MMddyyyy = 'MM/dd/yyyy',
    /**
     * Short month day, year
     * @example Jun 17, 2026
     */
    MMMdyyyy = 'MMM d, yyyy',
    /**
     * Long month day, year
     * @example June 17, 2026
     */
    MMMMdyyyy = 'MMMM d, yyyy',
}
