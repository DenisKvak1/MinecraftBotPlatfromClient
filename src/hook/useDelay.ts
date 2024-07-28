import {computed, ref, Ref, watch, watchEffect} from "vue";

export const useDelay = (value: Ref<boolean>, startValue: boolean = true, timeout: number = 500)=> {
    const isValue = ref(startValue)
    const isLoad = ref(true)

    setTimeout(()=>{
        watchEffect(()=> isValue.value = value.value)
        isLoad.value = false
    }, timeout)

    return {isValue, isLoad}
}