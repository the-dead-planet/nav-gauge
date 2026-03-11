package com.yourapp.videorenderer

import com.facebook.react.bridge.*

class VideoRendererModule(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "VideoRenderer"

    /** Start recording a native view passed directly from JS */
    @ReactMethod
    fun startRecordingNative(viewTag: Int, outputPath: String, promise: Promise) {
        try {
            val view = NativeViewRegistry.getView(viewTag)
            if (view == null) {
                promise.reject("VIEW_NOT_FOUND", "Cannot find native view for recording")
                return
            }

            Thread {
                        try {
                            VideoEncoder.stopRequested = false
                            val encoder = VideoEncoder()
                            encoder.renderVideo(view, outputPath)
                            promise.resolve(outputPath)
                        } catch (e: Exception) {
                            promise.reject("VIDEO_ERROR", e)
                        }
                    }
                    .start()
        } catch (e: Exception) {
            promise.reject("VIDEO_ERROR", e)
        }
    }

    @ReactMethod
    fun stopRecording(promise: Promise) {
        VideoEncoder.stopRequested = true
        promise.resolve(true)
    }
}
