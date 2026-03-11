package com.yourapp.videorenderer

import android.view.View
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class MapContainerViewManager : SimpleViewManager<View>() {

    override fun getName(): String = "MapContainerView"

    override fun createViewInstance(reactContext: ThemedReactContext): View {
        val view = View(reactContext)
        // Register the view for Kotlin recording
        val tag = view.id
        NativeViewRegistry.register(tag, view)
        return view
    }

    override fun onDropViewInstance(view: View) {
        NativeViewRegistry.unregister(view.id)
        super.onDropViewInstance(view)
    }
}
