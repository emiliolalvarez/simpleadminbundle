<?php
namespace SimpleAdmin\Bundle\SimpleAdminBundle\APIController;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as FOS;
/**
* @FOS\NamePrefix("api_")
*/
class TestRestController extends Controller{

    public function getInfoTestRestAction(Request $request){

    }

}