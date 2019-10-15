<template>
  <div class="row">
    <div class="col-md-8">
      <edit-profile-form :model="model">
      </edit-profile-form>
    </div>
    <div style="float: left; margin-top: 50px; width: 50%;">
      <h4>{{$t('settings.metrics')}}</h4>
      <ul style="list-style-type: none; padding-left: 0px;">
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.currency')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.exchange') + "/" + $t('research.stockPickingLab.filters.index')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.riskProfile')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.sampleMetrics')}}</base-checkbox>
        </li>
      </ul>
      <base-button type="secondary" fill>{{$t('settings.save')}}</base-button>        
    </div>
  </div>
</template>
<script>
  import EditProfileForm from '@/pages/Profile/EditProfileForm';
  export default {
    components: {
      EditProfileForm,
    },
    data() {
      return {
        model: {
          company: 'Creative Code Inc.',
          email: 'mike@email.com',
          username: 'michael23',
          firstName: 'Mike',
          lastName: 'Andrew',
          address: 'Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09',
          city: 'Melbourne',
          country: 'Australia',
          about: 'Lamborghini Mercy, Your chick she so thirsty, I\'m in that two seat Lambo.'
        },
        user: {
          fullName: 'Mike Andrew',
          title: 'Ceo/Co-Founder',
          description: `Do not be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...`,
        }
      }
    }
  }
</script>
<style>
</style>
