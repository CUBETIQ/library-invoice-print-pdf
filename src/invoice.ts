import {CanvasElement, Content, TDocumentDefinitions} from "pdfmake/interfaces";
import {useEffect, useState} from "react";
import pdfMake from "pdfmake/build/pdfmake";


export interface DataToPrint {
    configs: {
        title?: string,
        logoUrl?: string,
        headline?: string,
        columnsHeader: Array<Content>,
    }
    data: {
        header: any,
        items: any[],
        summary: any,
        footer?: Array<Content>
    }
}

const isInvoiceMasterRow = (i: number) => {
    return i % 2 === 0 && i === 0
}
pdfMake.fonts = {
    "Khmer": {
        normal: 'kh-battambang.ttf',
        bold: 'kh-battambang.ttf',
        italics: 'kh-battambang.ttf',
        bolditalics: 'kh-battambang.ttf',
    },
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },
}
pdfMake.tableLayouts = {
    invoiceMasterReport: {
        paddingTop: function (i: number) {
            return isInvoiceMasterRow(i) ? 1 : 0
        },
        paddingBottom: function (i: number) {
            return isInvoiceMasterRow(i) ? 5 : 0
        },
        paddingLeft: function () {
            return 2
        },
        paddingRight: function () {
            return 2
        },
        fillColor: function (i: number) {
            return i === 1 ? 'black' : '#e4e4e4'
        },
        vLineWidth: function () {
            return 1
        },
        defaultBorder: false
    },


    invoiceNestedDetailReport: {
        paddingLeft: function () {
            return 1
        },
        paddingRight: function () {
            return 0
        },
        paddingBottom: function () {
            return 5
        },
        defaultBorder: false
    },
    invoiceLayout: {
        paddingLeft: function () {
            return 0
        },
        paddingRight: function () {
            return 0
        },
        paddingTop: function () {
            return 0.5
        },
        paddingBottom: function () {
            return 0.5
        },
        hLineWidth: function (i: number, node: any) {
            return i === 1 || i === node.table.body.length ? 0.2 : 0
        },
        vLineWidth: function () {
            return 0
        },
    },
    summaryInvoice: {
        paddingLeft: function () {
            return 0
        },
        paddingRight: function () {
            return 0
        },
        paddingTop: function () {
            return 5
        },
        paddingBottom: function () {
            return 5
        },
        hLineColor: function (i) {
            return i === 1 ? 'black' : '#e4e4e4';
        },
        vLineWidth: function () {
            return 1
        },
        defaultBorder: false
    }
}
const drawLine: (length?: number) => CanvasElement = (length = 292.26) => {
    return {
        type: 'line',
        x1: 0,
        y1: 0,
        x2: length,
        y2: 0,
        lineWidth: 0.2,
    }
}

export const useDoc = (mockData: DataToPrint) => {
    const [columns, setColumns] = useState<Array<any>>([])
    const [body, setBody] = useState<Array<any>>([])
    const [title, setTitle] = useState<Array<any>>([])
    const [summary, setSummary] = useState<Array<any>>([])

    useEffect(() => {
        setColumns(mockData.configs.columnsHeader)
    }, [])

    useEffect(() => {
        let temp: Array<any> = []
        // eslint-disable-next-line array-callback-return
        mockData.data.items.map((it: any) => {
            let current: Array<any> = []
            // eslint-disable-next-line array-callback-return
            Object.values(it).map(function (key, index) {
                const data = {
                    text: key,
                    fontSize: 9,
                    alignment: columns[index]?.alignment
                }
                current.push(data)
            })
            temp.push(current)
        })
        setBody([...temp])
    }, [columns])


    useEffect(() => {
        let temp: Array<any> = []
        // eslint-disable-next-line array-callback-return
        Object.keys(mockData.data.header).map(function (key) {
            const keyLabel = {
                text: key + " :",
                fontSize: 9,
                alignment: "left"
            }
            const value = {
                // @ts-ignore
                text: mockData.data?.header[key],
                fontSize: 9,
                alignment: "right"
            }
            temp.push([keyLabel, value])
        })
        setTitle([...temp])
    }, [])


    useEffect(() => {
        const data = mockData.data.items.map((it: any) => {
            return {
                columns: [
                    Object.values(it).map(function (value, index) {
                        return {
                            text: value,
                            fontSize: 9,
                            width: "*",
                            alignment: columns[index]?.alignment,
                        }
                    })
                ]
            }
        })
        setBody([...data])
    }, [])


    useEffect(() => {
        let temp: Array<any> = []
        // eslint-disable-next-line array-callback-return
        Object.keys(mockData.data.summary).map(function (key) {
            const keyLabel = {
                text: key + " :",
                fontSize: 9,
                alignment: "right"
            }
            const value = {
                // @ts-ignore
                text: mockData.data?.summary[key],
                fontSize: 9,
                alignment: "center"
            }
            temp.push([keyLabel, value])
        })
        setSummary([...temp])
    }, [])


    const data: TDocumentDefinitions | any = {
        'content': [
            mockData.configs.logoUrl &&
            {
                alignment: 'center',
                image: mockData.configs.logoUrl,
                width: 100,
                height: 75,
                style: 'header',
                fontSize: 23,
                bold: true,
                margin: [0, 10],
            },
            mockData.configs.title &&
            {
                alignment: 'center',
                text: mockData.configs.title,
                style: 'header',
                fontSize: 8,
                bold: true,
                margin: [0, 10],
            },
            mockData.configs.headline &&
            {
                alignment: 'center',
                text: mockData.configs.headline,
                fontSize: 18,
                bold: true,

            },
            {
                layout: "noBorders",
                fontSize: 9,
                table: {
                    widths: "*",
                    body: [
                        ...title
                    ]
                }

            },
            {
                layout: "invoiceMasterReport",
                table: {
                    widths: '*',
                    body: [
                        mockData.configs.columnsHeader
                    ]
                }

            },
            {
                layout: "invoiceNestedDetailReport",
                table: {
                    widths: '*',
                    body: [
                        ...body,
                    ]
                }

            },
            {
                columns: [
                    {
                        canvas: [drawLine()]
                    }
                ]
            },
            {
                layout: "summaryInvoice",
                table: {
                    widths: ['*', '*'],
                    body: [
                        ...summary,
                    ]
                }

            },
            {
                columns: [
                    {
                        canvas: [drawLine()]
                    }
                ]
            },
            mockData.data.footer?.map(it => {
                return it
            })
        ],
        pageSize: {width: 302.26, height: "auto"},
        pageOrientation: "portrait",
        pageMargins: [5, 5, 5, 5],
        styles: {
            header: {
                color: "#2ac4e6"
            }
        }
    }

    return pdfMake.createPdf(data)
}

