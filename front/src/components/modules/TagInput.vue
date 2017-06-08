<template>
    <div class="multiselect" @blur="toggleSearch(false)" :tabindex="0">
        <div class="tag_container">
            <span class="selected_tag" v-for="tag in value">
                <span class="selected_tag_text">{{tag}}</span>
                <a
                    aria-hidden="true"
                    @mousedown.prevent="removeTag(tag)"
                    class="selected_tag_remove">
                    x
                </a>
            </span>
        </div>
        <input class="search_bar" type="text" v-model="search"  :placeholder="placeholder" @focus="toggleSearch(true)" @blur="toggleSearch(false)"/>
        <div v-show="searching" class="search">
            <ul class="search_results">
                <li v-for="tag in filteredTags" class="search_result">
                    <span class="select_tag" @focus.prevent @click.stop="selectTag(tag)">{{tag}}</span>
                    <a @focus.prevent @click.stop="deleteTag(tag)" class="delete_tag">x</a>
                </li>
                <li v-show="filteredTags.length === 0">
                    <span class="select_tag" @focus.prevent @click.stop="createTag">{{search + " " + "Creer un tag"}}</span>
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
                this.$emit('input', this.value);
                this.search = "";
//                this.toggleSearch( false )
            },
            createTag(){
                this.$emit('menuAddTag', this.search);
                this.search = "";
            },
            removeTag( tag ){
                this.$emit('input', this.value.filter(e => e!== tag))
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
        border: none;
        border-radius: 7px;
        display: block;
        width: 85%;
        padding: 1rem;
        margin: 1rem auto;
        background: white;
    }
    .select_tag:hover, .delete_tag:hover, .selected_tag_remove:hover{
        cursor: pointer;
        background: red;
    }
</style>