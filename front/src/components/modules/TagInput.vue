<template>
    <div class="multiselect">
        <div class="tag_container">
            <span class="selected_tag" v-for="tag in selectedTags">
                <span class="selected_tag_text">tag</span>
                <i
                    aria-hidden="true"
                    @mousedown.prevent="removeTag(tag)"
                    class="selected_tag_remove">
                </i>
            </span>
        </div>
        <input type="text" v-model="search" @click="toggleSearch(true)" @blur="toggleSearch(false)" :placeholder="placeholder" v-bind:value="value"/>
        <div v-show="searching" class="search">
            <ul class="search_results">
                <li v-for="tag in filteredTags" class="search_result">
                    <span class="select_tag" @click="selectTag(tag)">{{tag}}</span>
                    <a @click="delete_tag" class="delete_tag">x</a>
                </li>
                <li v-show="filteredTags.length === 0">
                    <span class="select_tag" @click="createTag">{{search}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'multiselect',
        props: {
            placeholder: 'Ajouter un tag',
            createTagLabel: 'Créer un tag',
            selectTagLabel: 'Sélectionner',
            selectedTags: [],
            value: {
                type: Array,
                default: []
            }
        },
        data (){
            return{
                search: "",
                searching: false
            }
        },
        computed: {
            filteredTags () {
                return this.value.filter(t => t.indexOf(search) !== -1);
            }
        },
        methods: {
            selectTag(){

            },
            createTag(){

            },
            removeTag(){

            },
            deleteTag(){

            },
            toggleSearch( status ){
                this.searching = status;
            }
        }
    }
</script>