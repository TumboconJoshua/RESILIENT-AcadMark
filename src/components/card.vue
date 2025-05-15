<template>
    <div class="rounded-xl shadow-[rgba(0,0,0,0.35)_0px_5px_15px]">
        <div class="relative md:w-full border border-[#c0c0c0] rounded-xl overflow-hidden">
            <div class="p-5 relative z-10">
                <p class="text-base font-medium" :class="cardColor.text">{{ trackStand }}</p>
                <p class="text-5xl font-medium" :class="cardColor.text">{{ className }}</p>
                <p class="italic text-lg font-regular" :class="cardColor.text">{{ subjectName }}</p>
                <p class="text-base font-light" :class="cardColor.text">{{ formattedGradeLevel }}</p>
            </div>
            <div class="absolute top-0 right-0 w-full h-full overflow-hidden">
                <img class="opacity-50 h-50 absolute top-5 right-[-55px]" src="/assets/img/logo.png" alt="" />
            </div>
            <div class="rounded-b-xl flex justify-between items-center p-5 relative z-10" :class="cardColor.bg">
                <p class="text-base font-semibold text-white">{{ cardTitle }}</p>
                <p @click="goToClass"
                    class="relative overflow-hidden transition-colors duration-300 text-light text-base text-white border border-white py-2 px-7 rounded-xl cursor-pointer hover:bg-white hover:text-black group">
                    <span class="relative z-10">Enter</span>
                    <span
                        class="absolute bottom-0 left-0 w-[300%] h-[300%] bg-black/10 rounded-full -translate-x-1/2 translate-y-1/2 rotate-45 animate-wave"></span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    type: { type: String, required: true },
    trackStand: { type: String, required: true },
    className: { type: String, required: true },
    subjectName: { type: String, default: "General" },
    gradeLevel: { type: [String, Number], required: true },
    subject_id: { type: String, default: "" },
    classType: { type: String, required: true }
});

const router = useRouter();

const cardColor = computed(() => ({
    text: props.classType === "Advisory" ? "text-blue" : "text-green",
    bg: props.classType === "Advisory" ? "bg-blue" : "bg-green"
}));

const cardTitle = computed(() => 
    props.classType === "Advisory" ? "Advisory Class" : "Subject Class"
);

const formattedGradeLevel = computed(() => {
    const grade = Number(props.gradeLevel);
    if (grade >= 7 && grade <= 10) return `High School Grade ${grade}`;
    if (grade === 11 || grade === 12) return `Senior High Grade ${grade}`;
    return `Grade ${grade}`;
});

const goToClass = () => {
    router.push({
        name: 'class',
        params: {
            trackStand: props.trackStand,
            className: props.className,
            subjectName: props.subjectName,
            subject_id: props.subject_id,
            gradeLevel: props.gradeLevel,
            classType: props.classType
        }
    });
};
</script>
