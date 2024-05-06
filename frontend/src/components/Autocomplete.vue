<template>
	<div>
		<div class="relative">
			<input v-if="heading !== 'Où ca ??'" type="text" id="autocomplete" :placeholder="placeholder"
				v-model="selectedItem" @input="onInput"
				class="bg-gray-300 py-2 px-4 flex justify-between items-center rounded w-full shadow-md shadow-zinc-600" />
			<input v-else type="text" id="autocomplete" ref="geocoder" :placeholder="placeholder" v-model="geoQuery"
				@input="handleInputGeocoder" class="bg-gray-300 py-2 px-4 flex justify-between items-center rounded w-full shadow-md shadow-zinc-600" />
			<ul v-if="dropdownOptions.length" class="absolute z-10 mt-2 bg-white border rounded shadow-md w-full">
				<li v-for="item in dropdownOptions" :key="item" @click="selectItem(item)" class="p-4 rounded hover:bg-blue-500">
					<div v-if="this.heading === 'Où ca ??'">{{ item.place_name }}</div>
					<div v-else> {{ item.name }}</div>
				</li>
			</ul>
			<button v-else-if="selectedItem !== '' && canAddNewOption" class="p-2 mt-2 w-full bg-green-300 border border-dotted border-black rounded" @click="addNewOption">Add "{{
				selectedItem }}"</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	props: {
		heading: {
			type: String,
			default: 'ta mère en short',
		},

		canAddNewOption: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			selectedItem: '',
			geoQuery: '',
			filteredItems: [],
			options: [],
			urlToFetch: '',
			placeholder: 'ta gueule',
			geocoderResult: [],
			coordinates: []
		};
	},

	created() {
		this.updateUrlToFetch(this.heading)
	},

	mounted() {
		this.fetchOptions();
	},

	computed: {
		dropdownOptions() {
			if (this.heading === 'Où ca ??') return this.geocoderResult
			else return this.filteredItems
		}
	},

	methods: {
		async fetchOptions() {
			try {
				const response = await axios.get(`${this.urlToFetch}`)
				this.options = response.data;
			} catch (error) {
				console.error('Error fetching options:', error)
			}
		},

		filterItems() {
			const query = this.selectedItem.toLowerCase();
			this.filteredItems = query === '' ? [] : this.options.filter(item => item.name.toLowerCase().includes(query))
		},

		selectItem(item) {
			if (this.heading === 'Où ca ??') {
				this.geoQuery = item.place_name
				this.coordinates = item.geometry.coordinates
				this.geocoderResult = []
				this.$emit('item-selected', { header: this.heading, coordinates: this.coordinates })
			} else {
				this.selectedItem = item.name
				this.$emit('item-selected', { header: this.heading, name: this.selectedItem, id: item.id })
			}
			this.filteredItems = []
		},

		onInput() {
			if (this.selectedItem === '') {
				this.filteredItems = []
				this.$emit('item-selected', { header: this.heading, name: '', id: undefined });
				this.$emit('item-inputted', { header: this.heading, name: '', id: undefined });
			} else {
				this.$emit('item-inputted', { header: this.heading, name: this.selectedItem });
				if (this.heading !== 'Track title') { this.filterItems() };
			}
		},

		updateUrlToFetch(heading) {
			switch (heading) {
				case 'Instrument recherchié':
					this.urlToFetch = '/instruments'
					this.placeholder = 'Chainsaw'
					break;
				case 'Genre de zikmu':
					this.urlToFetch = '/genres'
					this.placeholder = 'Fuck metal'
					break;
				case 'Où ca ??':
					this.urlToFetch = '/genres'
					this.placeholder = 'Islamaveryverybad'
					break;
				case 'Track title':
					this.urlToFetch = '/genres'
					this.placeholder = 'Allah akbar'
					break;
				case 'Receiver':
					this.urlToFetch = '/api/v1/users'
					this.placeholder = 'Allah akbar'
					break;
				default:
					this.urlToFetch = '/tracks'
			}
		},

		handleInputGeocoder() {
			if (this.geoQuery === '') { this.geocoderResult = [] }
			else if (this.geoQuery.length >= 4) {
				this.triggerGeocodeRequest();
			}
		},

		async triggerGeocodeRequest() {
			try {
				const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.geoQuery}.json?access_token=pk.eyJ1Ijoia2ViYWJhY29vbCIsImEiOiJjbHQ1bnVoN3QwMmdnMmxzMGppenlja3VvIn0.IFeRK3uh56z33cdb--8Nbw`)
				this.geocoderResult = response.data.features
				console.log('in ze geocoder', this.geocoderResult)
			} catch (error) {
				console.error('Error fetching tracks:', error)
			}
		},

		addNewOption() {
			this.$emit('add-new-option', { newOption: this.selectedItem, from: this.heading })
			this.selectedItem = ''
		}
	}
}
</script>