<template>
    <div class="multiselect">
        <div class="tag_container">
            <span class="selected_tag" v-for="tag in value">
                <span class="selected_tag_text">{{tag}}</span>
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
                this.value.push(tag);
                this.$emit('input', this.value);
            },
            createTag(){
                this.$emit('addTag', this.search)
            },
            removeTag( tag ){
                this.value = this.value.filter(e => e!== tag);
                this.$emit('input', this.value)
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