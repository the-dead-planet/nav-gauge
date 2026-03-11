package com.yourapp.videorenderer

import android.view.View

object NativeViewRegistry {

    private val viewMap = mutableMapOf<Int, View>()

    fun register(tag: Int, view: View) {
        viewMap[tag] = view
    }

    fun getView(tag: Int): View? = viewMap[tag]

    fun unregister(tag: Int) {
        viewMap.remove(tag)
    }
}
