<template>
    <div class="multiselect" @blur="toggleSearch(false)" @click="toggleSearch(true)" :tabindex="-1">
        <div class="tag_container">
            <span class="selected_tag" v-for="tag in value">
                <span class="selected_tag_text">{{tag}}</span>
                <i
                    aria-hidden="true"
                    @mousedown.prevent="removeTag(tag)"
                    class="selected_tag_remove">
                    x
                </i>
            </span>
        </div>
        <input class="search_bar" type="text" v-model="search"  :placeholder="placeholder"/>
        <div v-show="searching" class="search">
            <ul class="search_results">
                <li v-for="tag in filteredTags" class="search_result">
                    <span class="select_tag" v-on:click="selectTag(tag)">{{tag}}</span>
                    <a v-on:click="deleteTag(tag)" class="delete_tag">x</a>
                </li>
                <li v-show="filteredTags.length === 0">
                    <span class="select_tag" v-on:click="createTag">{{search + " " + "Creer un tag"}}</span>
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
            tagsValues: {
                type: Array,
                required: true
            },
            value: {
                type: null,
                default: function _default() {
                    return [];
                }
            },
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
                this.value.push(tag);
                this.searching = false;
                this.$emit('input', this.value);
            },
            createTag(){
                this.$emit('menuAddTag', this.search)
            },
            removeTag( tag ){
                this.value = this.value.filter(e => e!== tag);
                this.$emit('input', this.value)
            },
            deleteTag( tag ){
                this.$emit('menuDeleteTag', tag);
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
    .select_tag:hover, .delete_tag:hover, .selected_tag_remove:hover{
        cursor: pointer;
        background: red;
    }
</style>