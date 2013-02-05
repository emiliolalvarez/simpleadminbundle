{% extends "RGRedGuruBundle::base.html.twig" %}

{%- block share_title -%}
    {% if job.user %}
        {{ "%user% is looking for a %role%"|trans({"%user%":job.user.fullname,"%role%":job.role.name})|raw }}
    {% else %}
        {{ "%organization% is looking for a %role%"|trans({"%organization%":job.organization.name,"%role%":job.role.name})|raw }}
    {% endif %}
{%- endblock -%}
{%- block share_message -%}
    {{ "See the job description at Redguru!"|trans|raw }}
{%- endblock -%}
{%- block share_link -%}
    {{ "http://" ~ site_host ~ path("rg_redguru_job_detail",{"slug":job.slug}) }}
{%- endblock -%}

{% set showReferral = is_granted('IS_AUTHENTICATED_REMEMBERED') and job.canRefer(user) ? true : false %}

{% if showReferral %}
    {% set recommend_action_text = "Refer" %}
{% else %}
    {% set recommend_action_text = "Recommend" %}
{% endif %}

{% block content_container %}
    {{ parent() }}
    <div class="container"{% if not is_owner %} ng-controller="RecommendPersonToJobController"{% endif %}>
    <div class="user-card panel">
        <div class="row">
            <div class="span2 user-avatar">
                <div class="photoborder-organization">
                    {% if job.user %}
                        {% if job.user.photo %}
                            {% thumbnail job.user.photo, 'profile' %}
                        {% else %}
                            <div class="no-photo no-photo-profile"></div>
                        {% endif %}
                    {% else %}
                        {% if job.organization.photo %}
                            {% thumbnail job.organization.photo, 'profile' with {'class':'photoborder-organization'} %}
                        {% else %}
                            <div class="no-photo no-photo-company no-photo-company-profile photoborder-organization"></div>
                        {% endif %}
                    {% endif %}
                </div>
            </div>
            <div class="user-info span8">
                <h3 class="small">
                    {% if job.user %}
                        {{ '%user% is looking for talent'|trans({'%user%': "<a href='#{ path('rg_redguru_default_slug', {slugname: job.user.slug}) }'>#{ job.user.fullname }</a>"})|raw }}
                    {% else %}
                        {{ '%organization% is looking for talent'|trans({'%organization%': "<a href='#{ path('rg_redguru_default_slug', {slugname: job.organization.slug}) }'>#{ job.organization.name }</a>"})|raw }}
                    {% endif %}
                    <span class="user-date">-{{ "posted on %date%"|trans({'%date%': job.createdAt|date("d/m/Y")}) }}-</span>
                </h3>
                <h1 class="small">
                    {{ "%role% in %location%"|trans({'%role%': job.role.name, '%location%': "<span class=\"user-title-small\">#{job.location}</span>"})|raw }}
                </h1>
                <div class="tags">
                    {% for tag in job.tags %}
                        <span class='tag tag-job'>{{ tag.name | trans }}</span>
                    {% endfor %}
                </div>
                {% if job.contractType %}
                    <div class="user-description">
                        {{ "Contract type: %contract%"|trans({'%contract%': job.contractType.name|trans({}, 'ContractType')}) }}
                    </div>
                {% endif %}
                <div class="user-description">{{ job.description }}</div>
                {% set job_link = '<a href="' ~ app.request.uri ~  '">' ~ job.role.name ~  '</a>' %}
                <div>
                    {% if is_granted('IS_AUTHENTICATED_REMEMBERED') %}
                        {% if not is_owner %}
                            <div class="pull-left">
                                {% if showReferral %}
                                    <div class="panel job-referral-info">
                                        <legend>{{ "You can participate of %organization%'s Referral Program!"|trans({"%organization%": job.organization.name}) }}</legend>
                                        <div class="pull-left">
                                            <b>{{ "Referral Price"|trans }}:</b> {{ job.referralCurrency.symbol }} {{ job.referralPrice }}
                                        </div>
                                        <div class="pull-right">
                                            <b>{{ "Valid through"|trans }}:</b> {{ job.referralStartDate|date("d/m/Y") }} - {{ job.referralEndDate|date("d/m/Y") }}
                                        </div>
                                        <br/><br/>
                                        <div>
                                            <b>{{ "Conditions"|trans }}:</b> {{ job.referralConditions }}
                                        </div>
                                        <br/><br/>
                                        <div align="center">
                                            {% include "RGRedGuruBundle:Job:apply-button.html.twig" with ({job:job, class:'btn btn-share btn-success btn-no-icon',token: referral_token, force_modal: force_modal})%}
                                            <span ng-cloak>{{ "or"|trans }}</span>
                                            <a class="btn btn-share btn-share-coworkers" ng-cloak ng-click="showRecommendModal({{ job.id }},'{{ job.role.name }}')">{{ "Refer someone!"|trans }}</a>
                                        </div>
                                    </div>
                                {% else %}
                                    {% include "RGRedGuruBundle:Job:apply-button.html.twig" with ({job:job, class:'btn btn-share btn-success btn-no-icon' })%}
                                    <span ng-cloak>{{ "or"|trans }}</span>
                                    <a class="btn btn-share btn-share-coworkers" ng-cloak ng-click="showRecommendModal({{ job.id }},'{{ job.role.name }}')">{{ "Recommend someone"|trans }}</a>
                                {% endif %}
                            </div>
                        {% endif %}
                    {% else %}
                        <div class="pull-left">
                            <a class="btn btn-share btn-success" href="{{ path('fos_user_security_login', {'_target_path': app.request.uri}) }}">{{ "Apply"|trans }}</a>
                            {{ "or"|trans }}
                            <a class="btn btn-share btn-share-coworkers" href="{{ path('fos_user_security_login', {'_target_path': app.request.uri}) }}">{{ "Recommend someone"|trans }}</a>
                        </div>
                    {% endif %}
                    <div class="profile-share pull-right">
                        {% set share_photo %}
                        {% if job.user %}
                            {% if job.user.photo %}
                                {% path job.user.photo, 'profile' %}
                            {% else %}
                                {% image "@RGRedGuruBundle/Resources/public/images/noavatar_profile.jpeg" %}{{ "http://" ~ site_host ~ asset_url }}{% endimage %}
                            {% endif %}
                        {% else %}
                            {% if job.organization.photo %}
                                {% path job.organization.photo, 'profile' %}
                            {% else %}
                                {% image "@RGRedGuruBundle/Resources/public/images/nologo_profile.jpg" %}{{ "http://" ~ site_host ~ asset_url }}{% endimage %}
                            {% endif %}
                        {% endif %}
                        {% endset %}
                    </div>


                    {# Share with coworkers and classmates buttons #}
                    <div class="profile-share redguru-network pull-right" ng-controller="MessageController">
                        <div ng-cloak class="share-title">{{ "Share on" | trans }}</div>
                        {% if is_granted('IS_AUTHENTICATED_REMEMBERED') %}
                            {% if has_coworkers %}
                                <a rg-tooltip data-original-title="{{ "My coworkers network" | trans }}" ng-cloak ng-click="showMultiMessageModal('work')" class="btn btn-share btn-share-coworkers"><i class="icon-group"></i></a>
                            {% endif %}
                            {% if has_classmates %}
                                <a rg-tooltip data-original-title="{{ "My classmates network" | trans }}" ng-cloak ng-click="showMultiMessageModal('education')" class="btn btn-share btn-share-classmates">
                                    {% image '@RGRedGuruBundle/Resources/public/images/toga-hat.png'%}
                                        <img src="{{ asset_url }}" />
                                    {% endimage %}
                                </a>
                            </span>
                            {% endif %}
                            <div class="modal message-modal" ui-modal ng-model="newMultiMessageShown" ng-init='form.type="share_talent_search" ; form.direct_complement_id={{ job.id }} ; form.subject={{ "%user% said you may be interested in the %role% position"|trans({'%role%': job_link, '%user%':user.fullName})|json_encode }}'>
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">×</button>
                                    <div ng-cloak ng-show="messageSent && !newMultiMessage.$valid" class="modal-notification alert-success">
                                        <span class="ng-binding"><i class="icon-ok"></i> {{ "Your message has been sent!" | trans }} </span>
                                    </div>
                                    {% set role_italics = '<i>' ~ job.role.name ~  '</i>' %}
                                    <h3>{{ "Share %role% talent search"|trans({'%role%': role_italics}) | raw }}</h3>
                                </div>
                                <div class="modal-body">
                                    <form name="newMultiMessage">
                                        <div>
                                            <span class="pull-right">{{ "Selected %selected% / %total%"|trans({'%selected%': '[[ selectedUsersCount ]]', '%total%': '[[ people.length ]]'}) }}</span>
                                            <label>
                                                {{ "Recipients"|trans }}
                                                {% image '@RGRedGuruBundle/Resources/public/images/spinner.gif'%}
                                                <img ng-show="loading" src="{{ asset_url }}" />
                                                {% endimage %}
                                            </label>
                                            <div class="users-block-only-name">
                                                <div ng-repeat="user in people | disableFilter:query | filter:byCurrentUser | orderBy:'full_name'" class="user-block user-block-grid user-block-pill" ng-click="toggle(user)" ng-class="{active:user.selected}">
                                                    <div class="user-block-name">[[ user.full_name ]]</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label>{{ "Subject"|trans }}</label>
                                            <span type="text" id="multi_message_subject">{{ "%user% said you may be interested in the %role% position"|trans({'%role%': job.role.name, '%user%':user.fullName})}}</span>
                                        </div>
                                        <div>
                                            <label>{{ "Message"|trans }}</label>
                                            <textarea id="multi_message_body" ng-model="form.body" placeholder="{{"Write your message here..."|trans}}" required></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button ng-click="sendMulti()" ng-hide="sending" class="btn btn-large btn-info" ng-disabled="isSendMultiDisabled()">{{ "Share"|trans }}</button>
                                    <button ng-show="sending" ng-disabled="true" class="btn btn-large btn-info">
                                        {% image '@RGRedGuruBundle/Resources/public/images/spinner.gif'%}
                                        <img src="{{ asset_url }}" />
                                        {% endimage %}
                                    </button>
                                    <button ng-click="cancelMulti()" class="btn">{{ "Cancel"|trans }}</button>
                                </div>
                            </div>
                        {% else %}
                            <a href="{{ path('fos_user_security_login', {'_target_path': app.request.uri}) }}" rg-tooltip data-original-title="{{ "My coworkers network" | trans }}" class="btn btn-share btn-share-coworkers"><i class="icon-group"></i></a>
                            <a href="{{ path('fos_user_security_login', {'_target_path': app.request.uri}) }}" rg-tooltip data-original-title="{{ "My classmates network" | trans }}" class="btn btn-share btn-share-classmates">
                                {% image '@RGRedGuruBundle/Resources/public/images/toga-hat.png'%}
                                <img src="{{ asset_url }}" />
                                {% endimage %}
                            </a>
                        {% endif %}

                        {% if job.user %}
                            {% set share_title = "%organization% is looking for a %role%"|trans({"%organization%":job.user.fullname,"%role%":job.role.name})|raw %}
                            {% set share_photo %}
                                {% if job.user.photo %}
                                    {% path job.user.photo, 'profile' %}
                                {% else %}
                                    {% image "@RGRedGuruBundle/Resources/public/images/noavatar_profile.jpeg" %}{{ "http://" ~ site_host ~ asset_url }}{% endimage %}
                                {% endif %}
                            {% endset %}
                        {% else %}
                            {% set share_title = "%organization% is looking for a %role%"|trans({"%organization%":job.organization.name,"%role%":job.role.name})|raw %}
                            {% set share_photo %}
                                {% if job.organization.photo %}
                                    {% path job.organization.photo, 'profile' %}
                                {% else %}
                                    {% image "@RGRedGuruBundle/Resources/public/images/nologo_profile.jpg" %}{{ "http://" ~ site_host ~ asset_url }}{% endimage %}
                                {% endif %}
                            {% endset %}
                        {% endif %}
                        {% set share_message = "See the job description at Redguru!"|trans|raw %}
                        {% if is_granted('IS_AUTHENTICATED_REMEMBERED') %}
                            {% set share_link = short_url("http://" ~ site_host ~ path("rg_redguru_job_detail",{"slug":job.slug,"token":app.user.referralProgramHash})) %}
                        {% else %}
                            {% set share_link = short_url("http://" ~ site_host ~ path("rg_redguru_job_detail",{"slug":job.slug})) %}
                        {% endif %}
                        <a class="btn btn-share btn-share-facebook" rg-tooltip data-original-title="{{ "Facebook" | trans }}" href="https://www.facebook.com/dialog/feed?app_id={{ facebook_app_id }}&link={{ share_link|escape("url") }}&picture={{ share_photo|trim|escape("url") }}&name={{ share_title|escape("url") }}&caption=Redguru&description={{ share_message|escape("url") }}" target="_blank" onclick="window.open(this.href+'&display=popup&redirect_uri={{ "http://" ~ site_host ~ "/close.html"|escape("url") }}', 'sharer','toolbar=0,status=0,width=536,height=346'); return false;"><i class="icon-facebook"></i></a>
                        <a class="btn btn-share btn-share-twitter" rg-tooltip data-original-title="{{ "Twitter" | trans }}" href="http://twitter.com/share?url={{ share_link|escape("url") }}&text={{ share_title|trim|escape("url") ~ ". " ~ share_message|trim|escape("url") }}" onclick="window.open(this.href, 'sharer','toolbar=0,status=0,width=626,height=436'); return false;" target="_blank"><i class="icon-twitter"></i></a>
                    </div>
                </div>
            </div>
        </div>
        {% if is_owner %}
            <div ng-controller="TalentController">
                <a ng-click="editTalentSearch({{ job | serialize }})" class="fold-edit-profile" rg-tooltip title="{{ "Edit this talent search"|trans }}"><i class="icon-fat-pencil"></i></a>
                {% include "RGRedGuruBundle:Job:talent-modal.html.twig" %}

                <div class="collapse" id="alert_delete">
                    <div class="alert alert-block alert-error">
                        <h4 class="alert-heading">
                            {{ "Are you sure you want to delete this talent search?"|trans }}
                        </h4>
                        <br/>
                        <a class="btn btn-danger" href="{{ path('rg_redguru_job_disable', {id: job.id }) }}">{{ "Yes, delete"|trans }}</a>
                        <button type="button" class="btn" data-toggle="collapse" data-target="#alert_delete">{{ "No, cancel"|trans }}</button>
                    </div>
                </div>
                <a data-toggle="collapse" data-target="#alert_delete" rel="tooltip" title="{{ "Delete this talent search"|trans }}" rg-tooltip class="fold-delete"><i class="icon-trash icon-fat-white"></i></a>
            </div>
        {% endif%}
    </div>

    {% if not is_owner %}
        <div class="modal users-modal" ui-modal ng-model="recommendPersonToJobShown" ng-init="job_owner_id={{ job.user ? job.user.id : 0 }}">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button>
                <div ng-show="addAnother" class="modal-notification alert-success">
                    <span><i class="icon-ok"></i>{{ "Thanks!, your recommendation has been sent to %user%."|trans({'%user%': job.user ? job.user.fullName : job.organization.name}) }}</span>
                </div>
                <h3>{{ recommend_action_text ~ " someone for %role%"|trans({'%role%': job.role.name}) }}</h3>
            </div>
            <div class="modal-body">
                <div ng-hide="selected_user">
                    <span ng-hide="organization">{{ "Type the full name of the person you want to " ~ recommend_action_text|trans }}</span>
                    <input type="text" ng-minlength="3" ng-model="query" ng-change="unselectUser()" placeholder="{{ "Search by name"|trans }}">
                </div>
                <div class="users-box" ng-hide="selected_user">
                    <div ng-repeat="user in people | filter:query | filter:byCurrentUser | filter:byCurrentWorkers | filter:byJobOwner | orderBy:'full_name'" class="user-block user-block-grid user-block-pill" ng-click="toggle(user)" ng-class="{active:user.selected}">
                        <div class="user-block-avatar avatar avatar-border" ng-switch on="!user.thumbnail">
                            <div class="no-photo no-photo-listing" ng-switch-when="true"></div>
                            <img width="64px" height="64px" ng-switch-default ng-src="[[ user.thumbnail ]]" />
                        </div>
                        <div class="user-block-name">[[ user.full_name ]]</div>
                    </div>
                </div>
                <div ng-show="selected_user">
                    <div class="user-block user-block-grid user-block-pill active" ng-click="toggle(selected_user)">
                        <div class="user-block-avatar avatar avatar-border" ng-switch on="!selected_user.thumbnail">
                            <div class="no-photo no-photo-listing" ng-switch-when="true"></div>
                            <img width="64px" height="64px" ng-switch-default ng-src="[[ selected_user.thumbnail ]]" />
                        </div>
                        <div class="user-block-name">[[ selected_user.full_name ]]</div>
                        <button type="button" class="close unselect-user">&times;</button>
                    </div>
                    <div>
                        <form name="recommendPeopleMessage" class="talent-message">
                            <textarea ng-model="form.message" placeholder="{{"Add any comments / info you consider necessary"|trans}}"></textarea>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div ng-show="selected_user && !loading">
                    <button ng-click="save()" type="button" ng-disabled="!canSave()" class="btn btn-large btn-info">{{ recommend_action_text|trans }} [[ selected_user.full_name ]]</button>
                    <button ng-click="cancel()" type="button" class="btn">{{ "Cancel"|trans }}</button>
                </div>
                {% image '@RGRedGuruBundle/Resources/public/images/spinner.gif'%}
                <img ng-show="loading" class="btn" src="{{ asset_url }}" />
                {% endimage %}
            </div>
        </div>
    {% endif %}
    </div>
{% endblock %}