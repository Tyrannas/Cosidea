<template>
    <div class="multiselect">
        <div class="tag_container" :selectedTags="selectedTags">
            <span class="selected_tag" v-for="tag in selectedTags">
                <span class="selected_tag_text">tag</span>
                <i
                    aria-hidden="true"
                    @mousedown.prevent="removeTag(tag)"
                    class="selected_tag_remove">
                </i>
            </span>
        </div>
        <input class="search_bar" type="text" v-model="search" @click="toggleSearch(true)" @blur="toggleSearch(false)" :placeholder="placeholder"/>
        <div v-show="searching" class="search">
            <ul class="search_results">
                <li v-for="tag in filteredTags" class="search_result">
                    <span class="select_tag" @click="selectTag(tag)">{{tag}}</span>
                    <a @click="deleteTag" class="delete_tag">x</a>
                </li>
                <li v-show="filteredTags.length === 0">
                    <span class="select_tag" @click="createTag">{{search + " " + "Creer un tag"}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'multiselect',
        model: {
            prop: 'selectedTags'
        },
        props: {
            placeholder: 'Ajouter un tag',
            createTagLabel: 'Créer un tag',
            selectTagLabel: 'Sélectionner',
            tagsValues: {
                type: Array,
                required: true
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
                return this.tagsValues.filter(t => t.indexOf(this.search) !== -1);
            }
        },
        methods: {
            selectTag( tag ){
                console.log(" on a selectionné un tag " + tag);
                this.selectedTags.push(tag);
                this.$emit('input', this.selectedTags);
            },
            createTag(){
                this.$emit('addTag', this.search)
            },
            removeTag( tag ){
                this.selectedTags = this.selectedTags.filter(e => e!== tag);
                this.$emit('input', this.selectedTags)
            },
            deleteTag( tag ){
                this.$emit('deleteTag', tag);
            },
            toggleSearch( status ){
                this.searching = status;
            }
        }
    }
</script>

<style>
    .multiselect{
        background: white;
        width: 100%;
        position: relative;
    }
    .select_tag:hover, .delete_tag:hover{
        cursor: pointer;
        background: red;
    }
</style>