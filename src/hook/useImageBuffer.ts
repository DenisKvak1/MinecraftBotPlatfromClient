import {onUnmounted, Ref, ref} from "vue";

export function useImageBuffer(imageBuffer: any | null) {
    const imageUrl = ref<string | null>(null);

    if (imageBuffer) {
        const data = new Uint8Array(imageBuffer.data)
        console.log(data)

        const blob = new Blob([data], { type: 'image/jpeg' }); // Замените тип на соответствующий вашему буферу
        imageUrl.value = URL.createObjectURL(blob);
    }

    // onUnmounted(() => {
    //     if (imageUrl.value) {
    //         URL.revokeObjectURL(imageUrl.value);
    //     }
    // });

    return {
        imageUrl
    };
}