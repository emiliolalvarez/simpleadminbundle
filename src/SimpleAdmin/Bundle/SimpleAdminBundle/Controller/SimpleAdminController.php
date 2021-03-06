<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class SimpleAdminController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        #return $this->render("SimpleAdminBundle:Default:index.html.twig",array("test"=>1));
        return array();
    }

    /**
     * @Route("/template/window/listing")
     * @Template()
     */
    public function listingWindowTemplateAction(Request $request){

        return array(
          'windowId'=>$request->query->get('windowId'),
          'totalPages'=>$request->query->get('totalPages'),
          'currentPage'=>$request->query->get('currentPage')
        );

    }

    /**
     * @Route("/template/window/edit")
     * @Template()
     */
    public function editWindowTemplateAction(Request $request){
      return array(
        'windowId'=>$request->query->get('windowId'),
        'editWindowId'=>$request->query->get('editWindowId'),
        'recordId'=>$request->query->get('recordId'),
      );
    }

    /**
     * @Route("/template/modal/listing/simple")
     * @Template()
     */
    public function simpleListingModalTemplateAction(Request $request){

      return array(
        'windowId'=>$request->query->get('windowId'),
        'openerWindowId'=>$request->query->get('openerWindowId'),
        'sourcePkColumn'=>$request->query->get('sourcePkColumn'),
        'targetPkColumn'=>$request->query->get('targetPkColumn'),
        'totalPages'=>$request->query->get('totalPages'),
        'currentPage'=>$request->query->get('currentPage')
      );

    }

}