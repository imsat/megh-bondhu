"use client"

import { useState, useEffect, useRef } from "react"
import { X, ExternalLink, Download } from "lucide-react"

interface PDFViewerProps {
    file: string
    title: string
    onClose: () => void
}

export default function PDFViewer({ file, title, onClose }: PDFViewerProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [file])

    const handleIframeLoad = () => {
        setLoading(false)
        setError(false)
    }

    const handleIframeError = () => {
        setLoading(false)
        setError(true)
    }

    const openInNewTab = () => {
        window.open(file, "_blank")
    }

    const downloadPDF = () => {
        const link = document.createElement("a")
        link.href = file
        link.download = title
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
                <h2 className="text-lg font-semibold text-slate-800 truncate flex-1 mr-4">{title}</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={downloadPDF}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download PDF"
                    >
                        <Download className="w-5 h-5 text-slate-600" />
                    </button>
                    <button
                        onClick={openInNewTab}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Open in new tab"
                    >
                        <ExternalLink className="w-5 h-5 text-slate-600" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-hidden bg-gray-100 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                            <p className="text-slate-600">Loading PDF...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="text-center max-w-md mx-auto p-6">
                            <p className="text-red-600 mb-4">Unable to display PDF in browser</p>
                            <div className="space-y-3">
                                <button
                                    onClick={downloadPDF}
                                    className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={openInNewTab}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open in New Tab
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <iframe
                    ref={iframeRef}
                    src={`${file}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title={title}
                    style={{
                        minHeight: "100%",
                        display: loading ? "none" : "block",
                    }}
                />
            </div>
        </div>
    )
}
