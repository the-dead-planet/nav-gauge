export interface AnimationControlsType {
    /**
     * Value in seconds by which to move current point on the route (relates to timestamp).
     */
    speedMultiplier: number;
    /**
     * How long to view the image for (in milliseconds).
     * Defaults to `3000` (3 seconds).
     */
    displayImageDuration: number;

    /**
     * Whether the camera should move to keep current point in the center of the map.
     * When set to `true`, `zoom` will be applied according to the user setting.
     * When set to `false`, zoom will be chosen automatically to fit the whole route on the map.
     */
    followCurrentPoint: boolean;
    /**
     * Only applicable if `followCurrentPoint` is set to `true`.
     */
    cameraZoom: number;
    /**
     * Camera angle (map bearing) From which side should the camera look at current point on the route. Map beaering.
     * If `autoRotate` is enabled, will be offset by the current point bearing.
     */
    cameraAngle: number;
    /**
     * Camera tilt (map pitch) to keep during recording. Value between 0 and 85.
     */
    cameraTilt: number;
    /**
     * Camera roll (map rotate) in degrees
     */
    cameraRoll: number;
    /**
     * Easing duration in milliseconds given to animation function.
     */
    easeDuration: number;

    /**
     * If set to `true`, will apply rotation according to the direction where current point is heading to.
     */
    autoRotate: boolean;
    /**
     * Used to detect the first points before/after current point which are at least half of that value away from current point.
     * Bearing for current point used to auto rotate the map will be calculated using this line.
     */
    bearingLineLengthInMeters: number;
    /**
     * Maximum amount of degrees to allow updating the map bearing each frame (when `autoRotate` is enabled).
     */
    maxBearingDiffPerFrame: number;
}

export enum AnimatrixTranslationKey {
    AnimatrixControls = 'animatrix-controls',
    General = 'general',
    FollowCurrentPoint = 'follow-current-point',
    AutoRotate = 'auto-rotate',
    CameraAngle = 'camera-angle',
    CameraRoll = 'camera-roll',
    BearingLineLengthInMeters = 'bearing-line-length-in-meters',
    MaxBearingDiffPerFrame = 'max-bearing-diff-per-frame',
    Pitch = 'pitch',
    Zoom = 'zoom',
    ImagePauseDuration = 'image-pause-duration',
    SpeedMultiplier = 'speed-multiplier',
    EaseDuration = 'ease-duration',
    Search = 'search',
}
