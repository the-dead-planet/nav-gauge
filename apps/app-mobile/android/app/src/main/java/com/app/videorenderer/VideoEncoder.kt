package com.yourapp.videorenderer

import android.graphics.*
import android.media.*
import android.view.View

class VideoEncoder {

    companion object {
        // Flag to stop recording dynamically
        @Volatile var stopRequested = false
    }

    fun renderVideo(view: View, outputPath: String) {

        val width = view.width
        val height = view.height

        if (width == 0 || height == 0) throw IllegalArgumentException("View dimensions must be > 0")

        val fps = 30
        val format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, width, height)
        format.setInteger(
                MediaFormat.KEY_COLOR_FORMAT,
                MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface
        )
        format.setInteger(MediaFormat.KEY_BIT_RATE, 4_000_000)
        format.setInteger(MediaFormat.KEY_FRAME_RATE, fps)
        format.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1)

        val encoder = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        encoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
        val surface = encoder.createInputSurface()
        encoder.start()

        val muxer = MediaMuxer(outputPath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
        var trackIndex = -1
        val bufferInfo = MediaCodec.BufferInfo()

        // Frame loop
        while (!stopRequested) {

            val bitmap = captureView(view)
            val canvas = surface.lockCanvas(null)
            canvas.drawBitmap(bitmap, 0f, 0f, null)
            surface.unlockCanvasAndPost(canvas)

            if (trackIndex == -1) {
                trackIndex = addTrackAndStartMuxer(encoder, muxer)
            }

            drainEncoder(encoder, muxer, bufferInfo, trackIndex)

            Thread.sleep((1000L / fps))
        }

        // End of stream
        encoder.signalEndOfInputStream()
        drainEncoder(encoder, muxer, bufferInfo, trackIndex)

        encoder.stop()
        encoder.release()
        muxer.stop()
        muxer.release()
    }

    private fun captureView(view: View): Bitmap {
        val bitmap = Bitmap.createBitmap(view.width, view.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        view.draw(canvas)
        return bitmap
    }

    private fun addTrackAndStartMuxer(encoder: MediaCodec, muxer: MediaMuxer): Int {
        val format = encoder.outputFormat
        val trackIndex = muxer.addTrack(format)
        muxer.start()
        return trackIndex
    }

    private fun drainEncoder(
            encoder: MediaCodec,
            muxer: MediaMuxer,
            bufferInfo: MediaCodec.BufferInfo,
            trackIndex: Int
    ) {
        while (true) {
            val outputBufferId = encoder.dequeueOutputBuffer(bufferInfo, 0)
            if (outputBufferId >= 0) {
                val encodedData = encoder.getOutputBuffer(outputBufferId) ?: continue

                encodedData.position(bufferInfo.offset)
                encodedData.limit(bufferInfo.offset + bufferInfo.size)

                if (bufferInfo.size != 0) {
                    muxer.writeSampleData(trackIndex, encodedData, bufferInfo)
                }

                encoder.releaseOutputBuffer(outputBufferId, false)

                if (bufferInfo.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0) break
            } else break
        }
    }
}
